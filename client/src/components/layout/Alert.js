// racf
import React from 'react'

export const Alert = (props) => {
    const { alert } = props;
    return (
        alert !== null && (
            <div className={`alert alert-${alert.type}`}>
                <i className="fas fa-info-circle" />{alert.msg}
            </div>
        )
    )
}

export default Alert;
