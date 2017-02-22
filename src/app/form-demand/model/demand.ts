export class Demand {
    constructor(
        public title: string,
        public description: string,
        public externalUserId: number,
        public categoryId: string,
        public districts: any[],
        public themes: any[],
        public sourceId: string,
        public pins: any[],
        public locationType: string
    ) { }
}
