import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { BlockIcon } from '@wordpress/block-editor';
import { ungroup } from '@wordpress/icons';
import {
    InspectorControls,
    useBlockProps,
    InnerBlocks,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import {
    PanelBody,
    ToggleControl,
    TextControl,
    BoxControl,
    __experimentalUnitControl as UnitControl,
    ColorPalette,
    BorderControl,
    Button,
    Flex,
    FlexItem,
    TabPanel,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { copy } from '@wordpress/icons';
import { store as noticesStore } from '@wordpress/notices';
import Save from './save';
import './editor.scss';
import '../frontend/frontend.scss';
import metadata from '../block.json';

// Register the block
registerBlockType(metadata.name, {
    ...metadata,
    icon: <BlockIcon icon={ungroup} />,
    edit: Edit,
    save: Save,
});

export default function Edit({ attributes, setAttributes, clientId }) {
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
        closeOnOutsideClick,
        useCustomCloseButton,
        customCloseButtonId,
    } = attributes;

    const [copySuccess, setCopySuccess] = useState(false);

    // Get access to the block's anchor and current post URL
    const { getBlockAttributes } = useSelect((select) => select(blockEditorStore), []);
    const { updateBlockAttributes } = useDispatch(blockEditorStore);
    const { createSuccessNotice } = useDispatch(noticesStore);
    const currentPostUrl = useSelect(select => {
        const { getPermalink } = select('core/editor');
        return getPermalink();
    }, []);

    // Reset copy success after 2 seconds
    useEffect(() => {
        if (copySuccess) {
            const timer = setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [copySuccess]);

    // Set the Modal ID to the clientId only if it's initially empty
    useEffect(() => {
        if (!id) {
            setAttributes({ id: clientId });
        }
    }, [clientId, id, setAttributes]);

    // Sync Modal ID with HTML anchor
    useEffect(() => {
        const blockAttributes = getBlockAttributes(clientId);
        const currentAnchor = blockAttributes?.anchor;

        // If Modal ID changes, update the anchor
        if (id && id !== currentAnchor) {
            updateBlockAttributes(clientId, { anchor: id });
        }
        // If anchor changes, update the Modal ID
        else if (currentAnchor && currentAnchor !== id) {
            setAttributes({ id: currentAnchor });
        }
    }, [id, clientId, getBlockAttributes, updateBlockAttributes, setAttributes]);

    const blockProps = useBlockProps();

    // Get modal URL in simplified format
    const getModalUrl = () => {
        if (!currentPostUrl || !id) return '';
        try {
            const url = new URL(currentPostUrl);
            return `${url.pathname}#${id}`;
        } catch (e) {
            return '';
        }
    };

    // Get full modal URL for copying
    const getFullModalUrl = () => {
        if (!currentPostUrl || !id) return '';
        return currentPostUrl + '#' + id;
    };

    // Handle URL copy
    const handleCopyUrl = async () => {
        const modalUrl = getFullModalUrl();
        try {
            await navigator.clipboard.writeText(modalUrl);
            createSuccessNotice(__('Copied URL to clipboard', 'simple-modal'), {
                type: 'snackbar',
                isDismissible: true,
            });
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

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
                <TabPanel
                    className="simple-modal-tabs"
                    tabs={[
                        {
                            name: 'settings',
                            title: __('Settings', 'simple-modal'),
                            className: 'simple-modal-settings-tab',
                        },
                        {
                            name: 'styles',
                            title: __('Styles', 'simple-modal'),
                            className: 'simple-modal-styles-tab',
                        },
                    ]}
                >
                    {(tab) => {
                        if (tab.name === 'settings') {
                            return (
                                <PanelBody>
                                    <ToggleControl
                                        label={__('Show in Editor', 'simple-modal')}
                                        checked={showInEditor}
                                        onChange={(value) => setAttributes({ showInEditor: value })}
                                    />
                                    <TextControl
                                        label={__('Modal ID', 'simple-modal')}
                                        value={id}
                                        onChange={(value) => setAttributes({ id: value })}
                                        help={__('Anchor ID for direct linking with button', 'simple-modal')}
                                    />
                                    <ToggleControl
                                        label={__('Close on outside click', 'simple-modal')}
                                        checked={closeOnOutsideClick}
                                        onChange={(value) => setAttributes({ closeOnOutsideClick: value })}
                                    />
                                    <ToggleControl
                                        label={__('Custom close button', 'simple-modal')}
                                        checked={useCustomCloseButton}
                                        onChange={(value) => setAttributes({ useCustomCloseButton: value })}
                                    />
                                    {useCustomCloseButton && (
                                        <TextControl
                                            label={__('Close Button ID', 'simple-modal')}
                                            value={customCloseButtonId}
                                            onChange={(value) => setAttributes({ customCloseButtonId: value })}
                                            help={__('ID of the button that closes the modal', 'simple-modal')}
                                        />
                                    )}

                                    <div className="components-base-control modal-url-control">
                                        <TextControl
                                            label={__('Modal URL', 'simple-modal')}
                                            value={getModalUrl()}
                                            readOnly
                                            help={__('Link to modal via URL', 'simple-modal')}
                                        />
                                        <Button
                                            icon={copy}
                                            label={__('Copy URL', 'simple-modal')}
                                            onClick={handleCopyUrl}
                                            disabled={!currentPostUrl || !id}
                                            style={{ marginTop: '28px' }}
                                        />
                                    </div>
                                </PanelBody>
                            );
                        }
                        
                        if (tab.name === 'styles') {
                            return (
                                <PanelBody>
                                    <TextControl
                                        label={__('Title', 'simple-modal')}
                                        value={title}
                                        onChange={(value) => setAttributes({ title: value })}
                                    />
                                    <div className="components-base-control padding-control">
                                        <BoxControl
                                            __next40pxDefaultSize
                                            values={padding}
                                            onChange={(value) => setAttributes({ padding: value })}
                                            label={__('Padding', 'simple-modal')}
                                            allowReset={false}
                                        />
                                    </div>
                                    <div className="components-base-control max-width-control">
                                        <UnitControl
                                            label={__('Max Width', 'simple-modal')}
                                            value={maxWidth}
                                            onChange={(value) => setAttributes({ maxWidth: value })}
                                            units={[
                                                { value: 'px', label: 'px' },
                                                { value: '%', label: '%' },
                                            ]}
                                        />
                                    </div>
                                    <div className="components-base-control background-color-control">
                                        <label className="components-base-control__label">
                                            {__('Background Color', 'simple-modal')}
                                        </label>
                                        <ColorPalette
                                            value={backgroundColor}
                                            onChange={(value) => setAttributes({ backgroundColor: value })}
                                            clearable={false}
                                        />
                                    </div>
                                    <div className="components-base-control border-control">
                                        <BorderControl
                                            label={__('Border', 'simple-modal')}
                                            onChange={handleBorderChange}
                                            className="height-fix"
                                            value={{
                                                color: borderColor || '#000000',
                                                style: 'solid',
                                                width: borderWidth ? `${borderWidth}px` : '0',
                                            }}
                                        />
                                    </div>
                                    <div className="components-base-control border-radius-control">
                                        <UnitControl
                                            label={__('Border Radius', 'simple-modal')}
                                            value={borderRadius}
                                            onChange={(value) => setAttributes({ borderRadius: value })}
                                            units={[
                                                { value: 'px', label: 'px' },
                                                { value: '%', label: '%' },
                                            ]}
                                        />
                                    </div>
                                </PanelBody>
                            );
                        }
                    }}
                </TabPanel>
            </InspectorControls>
            <div {...blockProps}>
                {showInEditor && (
                    <div className="simple-modal-editor-preview">
                        <div className="simple-modal-overlay">
                            <div
                                className="simple-modal-content"
                                style={modalContentStyle}
                            >
                                <div className={`simple-modal-header${!title ? ' titleless' : ''}${useCustomCloseButton ? ' closeless' : ''}`}>
                                    {!useCustomCloseButton && (
                                        <button className="simple-modal-close">
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M27.0605 24.9395L24.9395 27.0605L4.93945 7.06055L7.06055 4.93945L27.0605 24.9395Z" fill="black"/>
                                            <path d="M7.06055 27.0605L4.93945 24.9395L24.9395 4.93945L27.0605 7.06055L7.06055 27.0605Z" fill="black"/>
                                            </svg>

                                        </button>
                                    )}
                                    {title && <h4 className="simple-modal-title">{title}</h4>}
                                </div>
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