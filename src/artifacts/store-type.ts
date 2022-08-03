export type Store = {
    version: '0.1.0';
    name: 'store';
    instructions: [
        {
            name: 'createCustomer';
            accounts: [
                {
                    name: 'user';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'customer';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'name';
                    type: 'string';
                },
                {
                    name: 'item';
                    type: 'string';
                }
            ];
        },
        {
            name: 'addComic';
            accounts: [
                {
                    name: 'user';
                    isMut: false;
                    isSigner: true;
                },
                {
                    name: 'customer';
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'comic';
                    type: 'string';
                }
            ];
        }
    ];
    accounts: [
        {
            name: 'customers';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'name';
                        type: 'string';
                    },
                    {
                        name: 'comics';
                        type: {
                            vec: 'string';
                        };
                    },
                    {
                        name: 'bump';
                        type: 'u8';
                    }
                ];
            };
        }
    ];
    errors: [
        {
            code: 6000;
            name: 'ExceedMaxLength';
            msg: 'Name string exceed 200 characters';
        }
    ];
};

export const IDL: Store = {
    version: '0.1.0',
    name: 'store',
    instructions: [
        {
            name: 'createCustomer',
            accounts: [
                {
                    name: 'user',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'customer',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'name',
                    type: 'string',
                },
                {
                    name: 'item',
                    type: 'string',
                },
            ],
        },
        {
            name: 'addComic',
            accounts: [
                {
                    name: 'user',
                    isMut: false,
                    isSigner: true,
                },
                {
                    name: 'customer',
                    isMut: true,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'comic',
                    type: 'string',
                },
            ],
        },
    ],
    accounts: [
        {
            name: 'customers',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'name',
                        type: 'string',
                    },
                    {
                        name: 'comics',
                        type: {
                            vec: 'string',
                        },
                    },
                    {
                        name: 'bump',
                        type: 'u8',
                    },
                ],
            },
        },
    ],
    errors: [
        {
            code: 6000,
            name: 'ExceedMaxLength',
            msg: 'Name string exceed 200 characters',
        },
    ],
};
