import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { BlockIcon } from '@wordpress/block-editor';
import { copySmall } from '@wordpress/icons';
import Editor from './editor';
import Save from './save';
import './editor.scss';
import './frontend.scss';
import metadata from './block.json';

// Register the block
registerBlockType(metadata.name, {
    ...metadata,
    icon: <BlockIcon icon={copySmall} />,
    edit: Editor,
    save: Save,
}); 