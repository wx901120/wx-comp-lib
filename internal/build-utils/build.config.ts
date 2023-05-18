import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
	entries: ['src/index'],
    // outDir:'build', // default is 'dist'
	clean: true,
	declaration: true, //Generates .d.ts declaration file
	rollup: {
		emitCJS: true
	}
})
