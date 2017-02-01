import { IDistrict, ITheme } from '@prodest/mapeandoes-typings';

export class Demand {
    constructor(
        public title: string,
        public description: string,
        public externalUserId: number,
        public categoryId: string,
        public districts: IDistrict[],
        public themes: ITheme[],
        public sourceId: string,
        public pins: any[]
    ) { }
}
