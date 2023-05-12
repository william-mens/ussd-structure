export function convertToTitleCase(record:string) {
    return record.split(' ').map(word=> word[0].toUpperCase() + word.substring(1).toLowerCase() ).join(' ')
}