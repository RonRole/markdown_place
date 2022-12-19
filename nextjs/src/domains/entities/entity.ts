export default interface Entity<UniqueKeyType> {
    get uniqueKey(): UniqueKeyType;
}