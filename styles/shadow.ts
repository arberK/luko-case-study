import { Platform } from 'react-native';
const SHADOW_COLOR = '#000000';
const SHADOW_OPACITY = 0.24;

export const shadow = (elevation: number) => {
    if (elevation === 0) {
        return {};
    }

    let height, radius;
    switch (elevation) {
        case 1:
            height = 0.5;
            radius = 0.75;
            break;
        case 2:
            height = 0.75;
            radius = 1.5;
            break;
        default:
            height = elevation - 1;
            radius = elevation;
    }

    return Platform.OS === "ios"
        ? {
            shadowColor: SHADOW_COLOR,
            shadowOffset: {
                width: 0,
                height,
            },
            shadowOpacity: SHADOW_OPACITY,
            shadowRadius: radius,
        }
        : {
            elevation: elevation,
        };
};