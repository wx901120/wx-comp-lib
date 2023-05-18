// 用来设置命名空间,采用的是BEM规范

import { InjectionKey, Ref, computed, inject, ref, unref } from 'vue'
// 这种方式第一次见
type isType = {
	(name: string, state: boolean | undefined): string
	(name: string): string
}
export const defaultNamespace = 'el'
const statePrefix = 'is-'

const _bem = (
	namespace: string,
	block: string,
	blockSuffix: string,
	element: string,
	modifier: string
) => {
	// el-button__element--modifier
	let cls = `${namespace}-${block}`
	if (blockSuffix) {
		cls += `-${blockSuffix}`
	}
	if (element) {
		cls += `__${element}`
	}
	if (modifier) {
		cls += `--${modifier}`
	}
	return cls
}

export const namespaceContextKey: InjectionKey<Ref<string | undefined>> =
	Symbol('namespaceContextKey')
// 获取一个派生出来的命名空间
export const useGetDerivedNamespace = (
	namespaceOverrides?: Ref<string | undefined>
) => {
	const derivedNamespace =
		namespaceOverrides || inject(namespaceContextKey, ref(defaultNamespace))
	const namespace = computed(() => {
		return unref(derivedNamespace) || defaultNamespace
	})
	return namespace
}

// BEM的组合就是在这个函数中完成的
export const useNamespace = (
	block: string,
	namespaceOverrides?: Ref<string | undefined>
) => {
	// 1. 拿到命名空间，如果传了的覆盖的就用覆盖的，否则就是默认的'el'
	const namespace = useGetDerivedNamespace(namespaceOverrides)

	// el-button
	const b = (blockSuffix = '') =>
		_bem(namespace.value, block, blockSuffix, '', '')
	const e = (element?: string) =>
		element ? _bem(namespace.value, block, '', element, '') : ''
	// el-button--primary
	const m = (modifier?: string) =>
		modifier ? _bem(namespace.value, block, '', '', modifier) : ''
	// el-button-suffix__element
	const be = (blockSuffix?: string, element?: string) =>
		blockSuffix && element
			? _bem(namespace.value, block, blockSuffix, element, '')
			: ''
	const em = (element?: string, modifier?: string) =>
		element && modifier
			? _bem(namespace.value, block, '', element, modifier)
			: ''
	const bm = (blockSuffix?: string, modifier?: string) =>
		blockSuffix && modifier
			? _bem(namespace.value, block, blockSuffix, '', modifier)
			: ''
	const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
		blockSuffix && element && modifier
			? _bem(namespace.value, block, blockSuffix, element, modifier)
			: ''

	// is-disabled
	const is: isType = (name: string, ...args: [boolean | undefined] | []) => {
		const state = args.length >= 1 ? args[0]! : true
		return name && state ? `${statePrefix}${name}` : ''
	}
	// for css var
	// --el-xxx: value;
	const cssVar = (object: Record<string, string>) => {
		const styles: Record<string, string> = {}
		for (const key in object) {
			if (object[key]) {
				styles[`--${namespace.value}-${key}`] = object[key]
			}
		}
		return styles
	}
	// with block
	//--el-xx-xxx: value
	const cssVarBlock = (object: Record<string, string>) => {
		const styles: Record<string, string> = {}
		for (const key in object) {
			if (object[key]) {
				styles[`--${namespace.value}-${block}-${key}`] = object[key]
			}
		}
		return styles
	}
	const cssVarName = (name: string) => `--${namespace.value}-${name}`
	const cssVarBlockName = (name: string) =>
		`--${namespace.value}-${block}-${name}`

	return {
		namespace,
		b,
		e,
		m,
		be,
		em,
		bm,
		bem,
		is,
		cssVar,
		cssVarName,
		cssVarBlock,
		cssVarBlockName
	}
}
export type UseNamespaceReturn = ReturnType<typeof useNamespace>
