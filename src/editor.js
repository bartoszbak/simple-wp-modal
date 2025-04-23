import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    InnerBlocks,
} from '@wordpress/block-editor';
import {
    PanelBody,
    ToggleControl,
    TextControl,
    BoxControl,
    __experimentalUnitControl as UnitControl,
    ColorPalette,
    SelectControl,
    Button,
    BorderControl
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
    const {
        id,
        title,
        padding,
        backgroundColor,
        borderColor,
        borderRadius,
        borderWidth,
        maxWidth,
        showInEditor,
    } = attributes;

    const blockProps = useBlockProps();

    // Create style object for dynamic styles that can't be handled by CSS
    const modalContentStyle = {
        backgroundColor,
        borderColor,
        borderRadius,
        borderWidth: borderWidth ? `${borderWidth}px` : undefined,
        borderStyle: borderWidth ? 'solid' : undefined,
        maxWidth: maxWidth ? maxWidth : '90%',
        padding: `${padding.top} ${padding.right} ${padding.bottom} ${padding.left}`,
    };

    // Handle border changes
    const handleBorderChange = (value) => {
        setAttributes({
            borderColor: value?.color,
            borderWidth: value?.width ? parseInt(value.width) : 0,
        });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Modal Settings', 'simple-modal')}>
                    <ToggleControl
                        label={__('Show in Editor', 'simple-modal')}
                        checked={showInEditor}
                        onChange={(value) => setAttributes({ showInEditor: value })}
                    />
                    <TextControl
                        label={__('Modal ID', 'simple-modal')}
                        value={id}
                        onChange={(value) => setAttributes({ id: value })}
                    />
                    <TextControl
                        label={__('Title', 'simple-modal')}
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                    />
                </PanelBody>
                <PanelBody title={__('Style Settings', 'simple-modal')}>
                    <BoxControl
                        __next40pxDefaultSize
                        values={padding}
                        onChange={(value) => setAttributes({ padding: value })}
                        label={__('Padding', 'simple-modal')}
                        allowReset={false}
                    />
                    <UnitControl
                        label={__('Max Width', 'simple-modal')}
                        value={maxWidth}
                        onChange={(value) => setAttributes({ maxWidth: value })}
                        units={[
                            { value: 'px', label: 'px' },
                            { value: '%', label: '%' },
                        ]}
                    />
                    <div className="components-base-control">
                        <label className="components-base-control__label">
                            {__('Background Color', 'simple-modal')}
                        </label>
                        <ColorPalette
                            value={backgroundColor}
                            onChange={(value) => setAttributes({ backgroundColor: value })}
                            clearable={false}
                        />
                    </div>
                    <BorderControl
                        label={__('Border', 'simple-modal')}
                        onChange={handleBorderChange}
                        value={{
                            color: borderColor || '#000000',
                            style: 'solid',
                            width: borderWidth ? `${borderWidth}px` : '0',
                        }}
                    />
                    <UnitControl
                        label={__('Border Radius', 'simple-modal')}
                        value={borderRadius}
                        onChange={(value) => setAttributes({ borderRadius: value })}
                        units={[
                            { value: 'px', label: 'px' },
                            { value: '%', label: '%' },
                        ]}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                {showInEditor && (
                    <div className="simple-modal-editor-preview">
                        <div className="simple-modal-overlay">
                            <div
                                className="simple-modal-content"
                                style={modalContentStyle}
                            >
                                <button className="simple-modal-close">×</button>
                                {title && <h3 className="simple-modal-title">{title}</h3>}
                                <div className="simple-modal-body">
                                    <InnerBlocks />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}