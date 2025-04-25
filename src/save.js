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
            >
                <div className="simple-modal-overlay">
                    <div className="simple-modal-content" style={modalContentStyle}>
                        <button className="simple-modal-close">×</button>
                        {title && <h3 className="simple-modal-title">{title}</h3>}
                        <div className="simple-modal-body">
                            <InnerBlocks.Content />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 