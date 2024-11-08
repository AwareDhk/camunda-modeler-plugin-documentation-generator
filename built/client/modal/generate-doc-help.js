import * as React from 'react';
// @ts-expect-error import
import { Modal } from 'camunda-modeler-plugin-helpers/components';
import { DOC_HELP_ACTIVITY_ASSIGNEE_LABEL, DOC_HELP_ACTIVITY_ASSIGNEE_PLACEHOLDER, DOC_HELP_ACTIVITY_DESCRIPTION_LABEL, DOC_HELP_ACTIVITY_DESCRIPTION_PLACEHOLDER, DOC_HELP_ACTIVITY_TYPE_LABEL, DOC_HELP_ACTIVITY_TYPE_PLACEHOLDER, DOC_HELP_ACTIVITY_NAME_LABEL, DOC_HELP_ACTIVITY_NAME_PLACEHOLDER, DOC_HELP_ACTIVITY_ORDER_LABEL, DOC_HELP_ACTIVITY_ORDER_PLACEHOLDER, DOC_HELP_PROCESS_ID_LABEL, DOC_HELP_PROCESS_ID_PLACEHOLDER, DOC_HELP_PROCESS_IS_EXECUTABLE_LABEL, DOC_HELP_PROCESS_IS_EXECUTABLE_PLACEHOLDER, DOC_HELP_PROCESS_NAME_LABEL, DOC_HELP_PROCESS_NAME_PLACEHOLDER, MODAL_TITLE } from '../constants';
export default function GenerateDocHelp(props) {
    // eslint-disable-next-line react/prop-types
    const { 
    // eslint-disable-next-line react/prop-types
    onClose } = props;
    return React.createElement(Modal, { className: "todo", onClose: onClose },
        React.createElement(Modal.Title, null, MODAL_TITLE),
        React.createElement(Modal.Body, null,
            React.createElement("p", null, "The following special template placeholders can be used in documentation template."),
            React.createElement("h3", null, "Process placeholders"),
            React.createElement("table", null,
                React.createElement("tbody", { className: "keyboard-shortcuts" },
                    React.createElement("tr", { key: "key" },
                        React.createElement("td", null,
                            React.createElement("b", null, DOC_HELP_PROCESS_NAME_LABEL)),
                        React.createElement("td", { className: "binding" }, DOC_HELP_PROCESS_NAME_PLACEHOLDER)),
                    React.createElement("tr", { key: "key" },
                        React.createElement("td", null,
                            React.createElement("b", null, DOC_HELP_PROCESS_ID_LABEL)),
                        React.createElement("td", { className: "binding" }, DOC_HELP_PROCESS_ID_PLACEHOLDER)),
                    React.createElement("tr", { key: "key" },
                        React.createElement("td", null,
                            React.createElement("b", null, DOC_HELP_PROCESS_IS_EXECUTABLE_LABEL)),
                        React.createElement("td", { className: "binding" }, DOC_HELP_PROCESS_IS_EXECUTABLE_PLACEHOLDER)))),
            React.createElement("h3", null, "Activities placeholders"),
            React.createElement("p", null,
                "Activities elements collection is available under ",
                React.createElement("i", null, "activities"),
                " placeholder. Each item contains the following properties"),
            React.createElement("table", null,
                React.createElement("tbody", { className: "keyboard-shortcuts" },
                    React.createElement("tr", { key: "key" },
                        React.createElement("td", null,
                            React.createElement("b", null, DOC_HELP_ACTIVITY_NAME_LABEL)),
                        React.createElement("td", { className: "binding" }, DOC_HELP_ACTIVITY_NAME_PLACEHOLDER)),
                    React.createElement("tr", { key: "key" },
                        React.createElement("td", null,
                            React.createElement("b", null, DOC_HELP_ACTIVITY_ORDER_LABEL)),
                        React.createElement("td", { className: "binding" }, DOC_HELP_ACTIVITY_ORDER_PLACEHOLDER)),
                    React.createElement("tr", { key: "key" },
                        React.createElement("td", null,
                            React.createElement("b", null, DOC_HELP_ACTIVITY_DESCRIPTION_LABEL)),
                        React.createElement("td", { className: "binding" }, DOC_HELP_ACTIVITY_DESCRIPTION_PLACEHOLDER)),
                    React.createElement("tr", { key: "key" },
                        React.createElement("td", null,
                            React.createElement("b", null, DOC_HELP_ACTIVITY_ASSIGNEE_LABEL)),
                        React.createElement("td", { className: "binding" }, DOC_HELP_ACTIVITY_ASSIGNEE_PLACEHOLDER)),
                    React.createElement("tr", { key: "key" },
                        React.createElement("td", null,
                            React.createElement("b", null, DOC_HELP_ACTIVITY_TYPE_LABEL)),
                        React.createElement("td", { className: "binding" }, DOC_HELP_ACTIVITY_TYPE_PLACEHOLDER)))),
                    ),
                        
        React.createElement(Modal.Footer, null,
            React.createElement("div", { className: "buttonDiv" },
                React.createElement("button", { className: "btn btn-primary", onClick: onClose }, "Close"))));
}
