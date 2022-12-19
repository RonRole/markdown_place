import Entity from "../entities/entity";

export default interface Repository<T extends Entity<unknown>> {
    findByUniqueKey(key: T['uniqueKey']): Promise<T | undefined>;
    findAll(): Promise<T[]>;
    save(newItem: T): Promise<boolean>;
    destroy(key: T['uniqueKey']): Promise<boolean>;
}