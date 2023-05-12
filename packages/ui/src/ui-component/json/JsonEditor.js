import { useState } from 'react'
import PropTypes from 'prop-types'
import { FormControl } from '@mui/material'
import ReactJson from 'react-json-view'

export const JsonEditorInput = ({ value, onChange, disabled = false, isDarkMode = false }) => {
    const [myValue, setMyValue] = useState(value ? JSON.parse(value) : {})

    return (
        <>
            <FormControl sx={{ mt: 1, width: '100%' }} size='small'>
                {disabled && (
                    <ReactJson
                        theme={isDarkMode ? 'ocean' : 'rjv-default'}
                        style={{ padding: 10, borderRadius: 10 }}
                        src={myValue}
                        name={null}
                        quotesOnKeys={false}
                        displayDataTypes={false}
                    />
                )}
                {!disabled && (
                    <ReactJson
                        theme={isDarkMode ? 'ocean' : 'rjv-default'}
                        style={{ padding: 10, borderRadius: 10 }}
                        src={myValue}
                        name={null}
                        quotesOnKeys={false}
                        displayDataTypes={false}
                        onEdit={(edit) => {
                            setMyValue(edit.updated_src)
                            onChange(JSON.stringify(edit.updated_src))
                        }}
                        onAdd={() => {
                            //console.log(add)
                        }}
                        onDelete={(deleteobj) => {
                            setMyValue(deleteobj.updated_src)
                            onChange(JSON.stringify(deleteobj.updated_src))
                        }}
                    />
                )}
            </FormControl>
        </>
    )
}

JsonEditorInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    isDarkMode: PropTypes.bool
}
