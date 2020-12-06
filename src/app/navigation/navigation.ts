import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    /* {
         id: 'dashboard',
         title: 'Dashboard',
         type: 'item',
         icon: 'dashboard',
         url: '/dashboard'
     },*/

    {
        id: 'courses',
        title: 'Courses',
        type: 'item',
        icon: 'class',
        url: '/courses'
    },
    {
        id: 'calendar',
        title: 'Calendar',
        type: 'item',
        icon: 'calendar_today',
        url: '/calendar',
    },
    {
        id: 'exams',
        title: 'Exams',
        type: 'item',
        icon: 'assignment',
        url: '/exams'
    },
    {
        id: 'study-sets',
        title: 'Study Sets',
        type: 'item',
        icon: 'note',
        url: '/study-sets'

    },
    {
        id: 'games',
        title: 'Games',
        type: 'item',
        icon: 'videogame_asset',
        url: '/games'
    },
    {
        id: 'settings',
        title: 'Settings',
        type: 'item',
        icon: 'settings_applications',
        url: '/settings'
    }
]


