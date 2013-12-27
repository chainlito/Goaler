import React from 'react';
import Modal from '@material-ui/core/Modal';
import './centeredModal.css';

export default ({children: Children, ...rest}) => (
    <Modal {...rest} className="centeredModal">{Children}</Modal>
);
