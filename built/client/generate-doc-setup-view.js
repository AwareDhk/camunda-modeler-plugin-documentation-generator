import * as React from 'react';
// @ts-expect-error import
import { Overlay, Section } from 'camunda-modeler-plugin-helpers/components';
import { useState } from 'react';
import { BUTTON_SELECT_TEMPLATE, SECTION_HEADER_IMPORT_TEMPLATE } from './constants';
const OVERLAY_OFFSET = { top: 0, right: 0 };
export default function GenerateDocSetupView(props) {
    const [inputFile, setInputFile] = useState(props.initValues.inputFile);
    const [chosenFileText, setChosenFileText] = useState('No file selected.');
    const handleInputFileClick = () => {
        const realInput = document.getElementById('inputFile');
        if (realInput !== null) {
            realInput.click();
        }
    };
    const handleInputFileChange = (event) => {
        const file = event.target !== null ? event.target.files[0] : null;
        if (file == null) {
            return;
        }
        setInputFile(file);
        setChosenFileText(file.name);
    };
    const handleSubmit = () => { props.onClose({ inputFile }); };
    return React.createElement(Overlay, { offset: OVERLAY_OFFSET, anchor: props.anchor, onClose: props.onClose },
        React.createElement(Section, { width: "400px" },
            React.createElement(Section.Header, null,
                SECTION_HEADER_IMPORT_TEMPLATE,
                " ",
                React.createElement("span", { onClick: props.onDocHelp }, " ?")),
            React.createElement(Section.Body, null,
                React.createElement("form", { id: "select-file", className: "import-form" },
                    React.createElement("fieldset", null,
                        React.createElement("div", { className: "fields" },
                            React.createElement("div", { className: "form-group" },
                                React.createElement("div", { className: "file-input" },
                                    React.createElement("button", { type: "button", className: "btn btn-primary", onClick: handleInputFileClick }, BUTTON_SELECT_TEMPLATE)),
                                React.createElement("input", { type: "file", id: "inputFile", accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", className: "form-control", name: "inputFile", onChange: handleInputFileChange }))))))),
        chosenFileText !== 'No file selected.'
            ? (React.createElement(React.Fragment, null,
                React.createElement(Section, { maxHeight: "400px" },
                    React.createElement(Section.Body, null,
                        React.createElement("form", { id: "import-form", className: "import-form", onSubmit: handleSubmit }, React.createElement(Section, { key: "document" },
                            React.createElement(Section.Header, null, "Template configuration"),
                            React.createElement(Section.Body, null,
                                React.createElement("fieldset", null,
                                    React.createElement("div", { className: "fields" },
                                        React.createElement("div", { className: "form-group" },
                                            React.createElement("label", null, "Name"),
                                            React.createElement("p", null, chosenFileText))))))))),
                React.createElement(Section, null,
                    React.createElement(Section.Body, null,
                        React.createElement(Section.Actions, null,
                            React.createElement("button", { type: "submit", className: "btn btn-primary", form: "import-form" }, "Generater doc"))))))
            : null);
}
