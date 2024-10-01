import { CSSProperties } from 'react';
import { COLUMN_PADDING, COLUMN_TOP_SPACE} from './Column.constants';

interface Style {
    [key: string]: CSSProperties;
}

const placeholderCommon: CSSProperties = {
    height: '90px',
    border: '2px dotted #3f51b5',
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
    borderRadius: '8px',
    opacity: 0.5,
};

const columnStyles: Style = {
    paper: {
        padding: `${COLUMN_PADDING}px`,
        width: '300px',
        minHeight: '500px',
        position: 'relative',
        paddingTop: `${COLUMN_TOP_SPACE}px`,
    },
    title: {
        padding: `${COLUMN_PADDING}px`,
        marginTop: `${-COLUMN_TOP_SPACE}px`,
        textAlign: 'center',
    },
};

const placeholderStyles: Style = {
    placeholderEmpty: {
        ...placeholderCommon,
        position: 'relative',
        width: `calc(100% - ${COLUMN_PADDING * 2}px)`,
        marginTop: `${COLUMN_PADDING}px`,
        marginLeft: `${COLUMN_PADDING}px`,
        marginBottom: `${COLUMN_PADDING}px`,
    },
    placeholderTop: {
        ...placeholderCommon,
        position: 'absolute',
        width: `calc(100% - ${COLUMN_PADDING * 4}px)`,
        left: `${COLUMN_PADDING * 2}px`,
        right: 0,
    },
    placeholderBetween: {
        ...placeholderCommon,
        position: 'absolute',
        width: `calc(100% - ${COLUMN_PADDING * 4}px)`,
        left: `${COLUMN_PADDING * 2}px`,
        right: 0,
    },
};

export { columnStyles, placeholderStyles };