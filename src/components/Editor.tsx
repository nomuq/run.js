import { VFC, useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import styles from './Editor.module.css';

export const Editor: VFC = () => {
	const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
	const monacoEl = useRef(null);

	useEffect(() => {
		if (monacoEl && !editor) {
			// validation settings
			monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
				noSemanticValidation: true,
				noSyntaxValidation: false
			});

			// compiler options
			monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
				target: monaco.languages.typescript.ScriptTarget.ES2020,
				allowNonTsExtensions: true
			});

			var code = localStorage.getItem('code') ?? 'function x() { console.log("Hello world!"); }';

			var e = monaco.editor.create(monacoEl.current!, {
				value: code,
				language: 'javascript',
				theme: 'vs-dark'
			});
			e.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
				console.log(eval(e.getValue()));
				return false;
			});
			
			setEditor(e);

			// auto save on change
			e.onDidChangeModelContent(() => {
				localStorage.setItem('code', e.getValue());
			}
			);
		}

		return () => editor?.dispose();
	}, [monacoEl.current]);

	return (
		<div
			style={{
				width: '100vw',
				height: '100vh'
			}}
			ref={monacoEl}
		></div>
	);
};
