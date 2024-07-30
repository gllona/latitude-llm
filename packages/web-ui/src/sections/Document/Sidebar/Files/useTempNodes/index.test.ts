import { act, renderHook } from '@testing-library/react'
import { Node } from '$ui/sections/Document/Sidebar/Files/useTree'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useTempNodes } from './index'

describe('useTempNodes', () => {
  afterEach(() => {
    useTempNodes.getState().reset()
  })

  it('should add a folder', async () => {
    const { result } = renderHook(() => useTempNodes((state) => state))
    act(() =>
      result.current.addFolder({
        parentPath: 'some-folder',
        parentId: 'fake-id',
        isFile: false,
      }),
    )

    expect(result.current.tmpFolders).toEqual({
      'some-folder': [
        new Node({
          id: expect.any(String),
          path: 'some-folder/ ',
          name: ' ',
          isFile: false,
          isPersisted: false,
        }),
      ],
    })
  })

  it('should update a folder', async () => {
    const { result } = renderHook(() => useTempNodes((state) => state))
    act(() =>
      result.current.addFolder({
        parentPath: 'some-folder',
        isFile: false,
        parentId: 'fake-id',
      }),
    )
    const id = result?.current?.tmpFolders?.['some-folder']?.[0]?.id
    act(() => result.current.updateFolder({ id: id!, path: 'new-name' }))

    expect(result.current.tmpFolders).toEqual({
      'some-folder': [
        new Node({
          id: expect.any(String),
          path: 'some-folder/new-name',
          name: 'new-name',
          isFile: false,
          isPersisted: false,
        }),
      ],
    })
  })

  it('should delete a folder', async () => {
    const { result } = renderHook(() => useTempNodes((state) => state))
    act(() =>
      result.current.addFolder({
        parentPath: 'some-folder',
        parentId: 'fake-id',
        isFile: false,
      }),
    )
    const id = result?.current?.tmpFolders?.['some-folder']?.[0]?.id
    act(() => result.current.deleteTmpFolder({ id: id! }))

    expect(result.current.tmpFolders).toEqual({ 'some-folder': [] })
  })

  it('should delete a folder children of another tmp folder', async () => {
    const { result } = renderHook(() => useTempNodes((state) => state))
    act(() =>
      result.current.addFolder({
        parentPath: 'some-folder',
        parentId: 'fake-id',
        isFile: false,
      }),
    )
    const id = result?.current?.tmpFolders?.['some-folder']?.[0]?.id
    act(() =>
      result.current.updateFolder({ id: id!, path: 'parent-tmp-folder' }),
    )

    act(() =>
      result.current.addFolder({
        parentPath: 'some-folder/parent-tmp-folder',
        parentId: id!,
        isFile: false,
      }),
    )

    const childId =
      result?.current?.tmpFolders?.['some-folder']?.[0]?.children?.[0]?.id
    act(() =>
      result.current.updateFolder({ id: childId!, path: 'child-tmp-folder' }),
    )
    act(() => result.current.deleteTmpFolder({ id: childId! }))

    expect(result.current.tmpFolders).toEqual({
      'some-folder': [
        new Node({
          id: expect.any(String),
          path: 'some-folder/parent-tmp-folder',
          name: 'parent-tmp-folder',
          isPersisted: false,
          isFile: false,
          children: [],
        }),
      ],
    })
  })

  it('should update the parent folder children', async () => {
    const { result } = renderHook(() => useTempNodes((state) => state))
    act(() =>
      result.current.addFolder({
        parentPath: 'some-folder',
        parentId: 'fake-id',
        isFile: false,
      }),
    )
    const id = result?.current?.tmpFolders?.['some-folder']?.[0]?.id
    act(() =>
      result.current.updateFolder({ id: id!, path: 'parent-tmp-folder' }),
    )

    act(() =>
      result.current.addFolder({
        parentPath: 'some-folder/parent-tmp-folder',
        parentId: id!,
        isFile: false,
      }),
    )

    const childId =
      result?.current?.tmpFolders?.['some-folder']?.[0]?.children?.[0]?.id

    act(() =>
      result.current.updateFolder({ id: childId!, path: 'child-tmp-folder' }),
    )

    const child = new Node({
      id: expect.any(String),
      path: 'some-folder/parent-tmp-folder/child-tmp-folder',
      name: 'child-tmp-folder',
      isPersisted: false,
      isFile: false,
      isRoot: false,
    })
    const rootTmpNode = new Node({
      id: expect.any(String),
      path: 'some-folder/parent-tmp-folder',
      name: 'parent-tmp-folder',
      isPersisted: false,
      isFile: false,
      children: [child],
    })
    child.parent = rootTmpNode
    rootTmpNode.children[0]!.parent = rootTmpNode
    expect(result.current.tmpFolders).toEqual({
      'some-folder': [rootTmpNode],
    })
  })

  it('should add a grand child folder after updating a node', async () => {
    const { result } = renderHook(() => useTempNodes((state) => state))
    act(() =>
      result.current.addFolder({
        parentPath: 'some-folder',
        parentId: 'fake-id',
        isFile: false,
      }),
    )
    const id = result?.current?.tmpFolders?.['some-folder']?.[0]?.id
    act(() =>
      result.current.updateFolder({ id: id!, path: 'parent-tmp-folder' }),
    )

    act(() =>
      result.current.addFolder({
        parentPath: 'some-folder/parent-tmp-folder',
        parentId: id!,
        isFile: false,
      }),
    )

    const childId =
      result?.current?.tmpFolders?.['some-folder']?.[0]?.children?.[0]?.id

    const spyFn = vi.fn()
    act(() =>
      result.current.updateFolderAndAddOther({
        id: childId!,
        path: 'child-tmp-folder',
        onNodeUpdated: spyFn,
      }),
    )

    const grandChild = new Node({
      id: expect.any(String),
      path: 'some-folder/parent-tmp-folder/child-tmp-folder/ ',
      name: ' ',
      isPersisted: false,
      isFile: false,
      isRoot: false,
    })
    const child = new Node({
      id: expect.any(String),
      path: 'some-folder/parent-tmp-folder/child-tmp-folder',
      name: 'child-tmp-folder',
      isPersisted: false,
      isFile: false,
      isRoot: false,
      children: [grandChild],
    })
    const rootTmpNode = new Node({
      id: expect.any(String),
      path: 'some-folder/parent-tmp-folder',
      name: 'parent-tmp-folder',
      isPersisted: false,
      isFile: false,
      children: [child],
    })

    child.parent = rootTmpNode
    grandChild.parent = child
    rootTmpNode.children[0]!.parent = rootTmpNode
    child.children[0]!.parent = child

    const grandChildInTmpFolders =
      result.current.tmpFolders['some-folder']?.[0]?.children?.[0]
        ?.children?.[0]
    expect(grandChildInTmpFolders).toEqual(grandChild)
    expect(spyFn).toHaveBeenCalledWith(
      'some-folder/parent-tmp-folder/child-tmp-folder',
    )
  })
})