var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
// @ts-expect-error import
import { Fill } from 'camunda-modeler-plugin-helpers/components';
// @ts-expect-error import
import WordIcon from '../resources/word-file.svg';
import { createRef } from 'react';
import { generateWordDocumentationFromBpmn } from '../generator';
import GenerateDocSetupView from './generate-doc-setup-view';
import GenerateDocHelp from './modal/generate-doc-help';
const defaultState = {
    activeTab: { type: '' },
    configOpen: false,
    modalOpen: false,
    modalDocHelpOpen: false,
    inputFile: undefined
};
const ENCODING_UTF8 = 'utf8';
const LOAD_TEMPLATE_EVENT = 'documentation-generator-plugin:loadTemplate';
const OPEN_HELP_MODAL_EVENT = 'documentation-generator-plugin:openHelpModal';
const FILTER_DOCX = {
    name: 'Word file',
    encoding: ENCODING_UTF8,
    extensions: ['docx']
};
export default class DocumentGeneratorPlugin extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = defaultState;
        this._buttonRef = createRef();
    }
    componentDidMount() {
        const { 
        // @ts-expect-error props
        subscribe } = this.props;
        subscribe(LOAD_TEMPLATE_EVENT, () => {
            this.openModal();
        });
        subscribe(OPEN_HELP_MODAL_EVENT, () => {
            this.openDocHelpModal();
        });
        subscribe('app.activeTabChanged', (event) => {
            this.setState({ activeTab: event.activeTab });
        });
    }
    handleDocumentGenerationSuccess(exportPath) {
        this.props.displayNotification({
            type: 'success',
            title: 'Document generation succeeded!',
            content: React.createElement(GenerationSuccess, { exportPath: exportPath }),
            duration: 10000
        });
    }
    handleDocumentGenerationError(error) {
        this.props.displayNotification({
            type: 'error',
            title: 'Document generation failed',
            content: 'See the log for further details.',
            duration: 10000
        });
        this.props.log({
            category: 'document-generator-error',
            message: error.message
        });
    }
    /**
       * Generates word document for process definition
       *
       * @returns {Promise<object>}
       */
    generateDocument(templateFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // (0) save tab contents
                const savedTab = yield this.props.triggerAction('save-tab', { tab: this.state.activeTab });
                // (1) ask user were to export the file
                const exportPath = yield this.props._getGlobal('dialog').showSaveFileDialog({
                    file: savedTab.file,
                    title: `Save ${savedTab.name} as ...`,
                    filters: [
                        FILTER_DOCX
                    ]
                });
                if (exportPath == null) {
                    return false;
                }
                const fileSystem = this.props._getGlobal('fileSystem');
                // 1. read template file
                const { contents } = yield fileSystem.readFile(templateFile.path, { encoding: false });
                const doc = yield generateWordDocumentationFromBpmn({ bpmnXml: savedTab.file.contents }, contents);
                // 3. save output
                yield fileSystem.writeFile(exportPath, { contents: doc });
                this.handleDocumentGenerationSuccess(exportPath);
            }
            catch (error) {
                console.log(error);
                this.handleDocumentGenerationError(error);
            }
            return true;
        });
    }
    openModal() {
        this.setState({ modalOpen: true });
    }
    handleConfigClosed(details) {
        if (!this.state.modalDocHelpOpen) {
            this.setState({ modalOpen: false });
        }
        if ((details === null || details === void 0 ? void 0 : details.inputFile) !== undefined) {
            void this.generateDocument(details === null || details === void 0 ? void 0 : details.inputFile);
        }
    }
    openDocHelpModal() {
        this.setState({ modalDocHelpOpen: true });
    }
    handleDocHelpModalClosed() {
        this.setState({ modalDocHelpOpen: false });
    }
    render() {
        const initValues = {
            inputFile: this.state.inputFile
        };
        return React.createElement(React.Fragment, null,
            isBPMN(this.state.activeTab) && (React.createElement(Fill, { slot: "tab-actions" },
                React.createElement("button", { ref: this._buttonRef, title: "Generate process definition documentation as Word doc", className: "btn btn--tab-action", onClick: this.openModal.bind(this) },
                    React.createElement(WordIcon, null)))),
            (Boolean(this.state.modalOpen)) && (React.createElement(GenerateDocSetupView, { anchor: this._buttonRef.current, onClose: this.handleConfigClosed.bind(this), onDocHelp: this.openDocHelpModal.bind(this), initValues: initValues })),
            (Boolean(this.state.modalDocHelpOpen)) && (React.createElement(GenerateDocHelp, { onClose: this.handleDocHelpModalClosed.bind(this) })));
    }
}
// Helpers
const GenerationSuccess = (props) => {
    return React.createElement("div", null,
        React.createElement("p", null, 'Word documentation was generated.'),
        React.createElement("p", null, 'Find your generated Word file at "' + props.exportPath + '".'));
};
const isBPMN = (tab) => {
    return tab.type === 'cloud-bpmn';
};
