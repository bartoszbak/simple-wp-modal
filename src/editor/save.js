import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { renderToString } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

export default function Save({ attributes }) {
    const {
        id,
        title,
        padding,
        backgroundColor,
        borderColor,
        borderRadius,
        borderWidth,
        maxWidth,
        closeOnOutsideClick,
        useCustomCloseButton,
        customCloseButtonId,
    } = attributes;

    const blockProps = useBlockProps.save();

    const modalContentStyle = {
        backgroundColor,
        borderColor,
        borderRadius,
        borderWidth: borderWidth ? `${borderWidth}px` : undefined,
        borderStyle: borderWidth ? 'solid' : undefined,
        maxWidth: maxWidth ? maxWidth : '90%',
        padding: `${padding.top} ${padding.right} ${padding.bottom} ${padding.left}`,
    };

    return (
        <div {...blockProps}>
            <div 
                className="simple-modal" 
                id={id}
                data-close-on-outside-click={closeOnOutsideClick}
                data-custom-close-button={useCustomCloseButton ? customCloseButtonId : ''}
            >
                <div className="simple-modal-overlay">
                    <div className="simple-modal-content" style={modalContentStyle}>
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
                            <InnerBlocks.Content />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 