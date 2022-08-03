import * as borsh from '@project-serum/borsh';

const comicDataSchema = borsh.struct([borsh.str('comicId')]);
const comicDataSchemaWithCustomer = borsh.struct([borsh.str('name'), borsh.str('comicId')]);

export const newComic = (comicId: string) => {
    const buffer = Buffer.alloc(1000);
    comicDataSchema.encode({ comicId }, buffer);
    const instruction = buffer.slice(1, comicDataSchema.getSpan(buffer));
    return instruction;
};

export const newComicWithCustomer = (comicId: string, name: string) => {
    const buffer = Buffer.alloc(1000);
    comicDataSchemaWithCustomer.encode({ name, comicId }, buffer);
    const instruction = buffer.slice(0, comicDataSchema.getSpan(buffer));
    return instruction;
};
