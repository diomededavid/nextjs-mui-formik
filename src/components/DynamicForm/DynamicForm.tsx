import React, { useCallback, useMemo, useState } from 'react';
import { makeStyles } from '@mui//material/styles'; // Update import
import { Button, Input } from '@mui/material'; // Update import
import { FormFieldSelectOption, FormFieldConfig, FormConfig } from './interfaces';
import GenericFormProps from './interfaces';
import classNames from 'classnames';
import { useIntl } from 'react-intl'; // Update import
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
    formWrapper: {
        minHeight: '400px',
        margin: '0 auto 35px',
        width: '80%',
    },
    section: {
        marginLeft: '0px',
    },
    arraySection: {
        display: 'block',
        marginTop: '10px',
    },
    groupedFieldWrapper: {
        display: 'inline',
    },
    field: {
        width: '48%',
        marginRight: '2%',
    },
    textArea: {
        width: '98%',
    },
    buttonWrapper: {
        marginTop: '15px',
    },
    removeButton: {
        marginLeft: '10px',
    },
}));

interface GenericFormProps {
    config: FormConfig;
}
const DynamicForm = ({ schema, formik, definitions, textAreaNames = [] }: GenericFormProps) => {
    const classes = useStyles();
    const intl = useIntl();
    const [quantitiesObject, setQuantitiesObject] = useState({});

    const getForm = useCallback(
        (jsonSchema, accKey = '', quantity = 1) =>
            Object.entries(jsonSchema).map(([key, value], index) => {
                let newAccKey = key;
                if (accKey) {
                    newAccKey = `${accKey}-${key}`;
                }

                switch (value.type) {
                    case 'object': {
                        return (
                            <div key={key} className={classes.section}>
                                <h1>{intl.formatMessage({ id: `builder.${key}` })}</h1>
                                {new Array(quantity).fill(null).map((v, i) => (
                                    <div
                                        className={classes.arraySection}
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={i}
                                    >
                                        {getForm(value.properties, `${newAccKey}-${i}`)}
                                    </div>
                                ))}
                            </div>
                        );
                    }

                    case 'array': {
                        const currQuantity = quantitiesObject[newAccKey] || 1;
                        return (
                            <div key={key} className={classes.section}>
                                {new Array(quantity).fill(null).map((v, i) => (
                                    <div
                                        className={classes.arraySection}
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={i}
                                    >
                                        {getForm(
                                            {
                                                [key]: value.items,
                                            },
                                            `${newAccKey}-${i}`,
                                            currQuantity
                                        )}
                                    </div>
                                ))}
                                <div className={classes.buttonWrapper}>
                                    <Button
                                        onClick={() => {
                                            setQuantitiesObject({
                                                ...quantitiesObject,
                                                [newAccKey]: currQuantity + 1,
                                            });
                                        }}
                                        color="primary"
                                        variant="contained"
                                    >
                                        {`+ ${intl.formatMessage({ id: `builder.${key}` })}`}
                                    </Button>
                                    {currQuantity > 1 && (
                                        <Button
                                            onClick={() => {
                                                setQuantitiesObject({
                                                    ...quantitiesObject,
                                                    [newAccKey]: currQuantity - 1,
                                                });
                                            }}
                                            color="secondary"
                                            variant="contained"
                                            className={classes.removeButton}
                                        >
                                            {`- ${intl.formatMessage({ id: `builder.${key}` })}`}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    case 'string':
                    default: {
                        if (!key) {
                            return null;
                        }

                        let inputProps = {};
                        // TODO this doesnt work
                        if (!value.type && value.$ref) {
                            let ref = definitions;
                            value.$ref.split('/').forEach((k) => {
                                if (ref[k]) {
                                    ref = ref[k];
                                }
                            });

                            if (ref.pattern) {
                                inputProps = {
                                    pattern: ref.pattern,
                                };
                            }
                        }

                        return (
                            <div key={key} className={classes.groupedFieldWrapper}>
                                {new Array(quantity).fill(null).map((v, i) => {
                                    const newKey = `${newAccKey}-${i}`;
                                    const isTextArea = textAreaNames.includes(key);

                                    return (
                                        <Input
                                            key={newKey}
                                            className={classNames(classes.field, {
                                                [classes.textArea]: isTextArea,
                                            })}
                                            multiline={isTextArea}
                                            rows={isTextArea ? 3 : 1}
                                            rowsMax={10}
                                            fullWidth
                                            id={newKey}
                                            name={newKey}
                                            label={intl.formatMessage({ id: `builder.${key}` })}
                                            value={formik.values[newKey]}
                                            onChange={formik.handleChange}
                                            error={formik.touched[newKey] && Boolean(formik.errors[newKey])}
                                            helperText={formik.touched[newKey] && formik.errors[newKey]}
                                            inputProps={inputProps}
                                        />
                                    );
                                })}
                            </div>
                        );
                    }
                }
            }),
        [
            classes.section,
            classes.arraySection,
            classes.buttonWrapper,
            classes.removeButton,
            classes.groupedFieldWrapper,
            classes.field,
            classes.textArea,
            intl,
            quantitiesObject,
            definitions,
            textAreaNames,
            formik.values,
            formik.handleChange,
            formik.touched,
            formik.errors,
        ]
    );

    const form = useMemo(
        () =>
            Object.entries(schema).map(([key, value]) => {
                if (!key) {
                    return null;
                }

                return getForm({
                    [key]: value,
                });
            }),
        [getForm, schema]
    );

    return <div className={classes.formWrapper}>{form}</div>;
};

export default DynamicForm;
