export class BaseService {
    model;
    constructor(model) {
        this.model = model;
    }
    async findAll() {
        return this.model.findAll();
    }
    async findById(id) {
        return this.model.findByPk(id);
    }
    async create(data) {
        return this.model.create(data);
    }
    async update(id, data) {
        const record = await this.model.findByPk(id);
        if (!record) {
            throw new Error(`${this.model.name} not found`);
        }
        return record.update(data);
    }
    async delete(id) {
        const record = await this.model.findByPk(id);
        if (!record) {
            throw new Error(`${this.model.name} not found`);
        }
        await record.destroy();
        return true;
    }
}
