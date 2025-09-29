/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/voting.json`.
 */
export type Voting = {
  "address": "Dkx6rMoHVhkPc1zzU8u7LxNFJ4NhBj3w7fNkNUhzDZDn",
  "metadata": {
    "name": "voting",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Voting program"
  },
  "instructions": [
    {
      "name": "closePoll",
      "discriminator": [
        139,
        213,
        162,
        65,
        172,
        150,
        123,
        67
      ],
      "accounts": [
        {
          "name": "pollAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "pollAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "pollId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pollId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeCandidate",
      "discriminator": [
        210,
        107,
        118,
        204,
        255,
        97,
        112,
        26
      ],
      "accounts": [
        {
          "name": "pollAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "pollAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "pollId"
              }
            ]
          }
        },
        {
          "name": "candidateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "pollId"
              },
              {
                "kind": "account",
                "path": "poll_account.candidates_count",
                "account": "poll"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pollId",
          "type": "u64"
        },
        {
          "name": "candidateName",
          "type": "string"
        },
        {
          "name": "candidateDescription",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializePoll",
      "discriminator": [
        193,
        22,
        99,
        197,
        18,
        33,
        115,
        117
      ],
      "accounts": [
        {
          "name": "pollAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "pollCounter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  108,
                  108,
                  95,
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "pollAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "poll_counter.poll_count",
                "account": "pollCounter"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pollName",
          "type": "string"
        },
        {
          "name": "pollDescription",
          "type": "string"
        },
        {
          "name": "pollStart",
          "type": "i64"
        },
        {
          "name": "pollEnd",
          "type": "i64"
        }
      ]
    },
    {
      "name": "initializePollCounter",
      "discriminator": [
        137,
        220,
        157,
        142,
        86,
        145,
        205,
        138
      ],
      "accounts": [
        {
          "name": "pollAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "pollCounter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  108,
                  108,
                  95,
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "voteForCandidate",
      "discriminator": [
        68,
        82,
        35,
        221,
        175,
        63,
        47,
        47
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": true,
          "signer": true
        },
        {
          "name": "pollAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "pollId"
              }
            ]
          }
        },
        {
          "name": "candidateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "pollId"
              },
              {
                "kind": "arg",
                "path": "candidateId"
              }
            ]
          }
        },
        {
          "name": "voteAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "pollId"
              },
              {
                "kind": "account",
                "path": "voter"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pollId",
          "type": "u64"
        },
        {
          "name": "candidateId",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "candidate",
      "discriminator": [
        86,
        69,
        250,
        96,
        193,
        10,
        222,
        123
      ]
    },
    {
      "name": "poll",
      "discriminator": [
        110,
        234,
        167,
        188,
        231,
        136,
        153,
        111
      ]
    },
    {
      "name": "pollCounter",
      "discriminator": [
        196,
        1,
        77,
        116,
        60,
        205,
        237,
        189
      ]
    },
    {
      "name": "vote",
      "discriminator": [
        96,
        91,
        104,
        57,
        145,
        35,
        172,
        155
      ]
    }
  ],
  "events": [
    {
      "name": "candidateCreated",
      "discriminator": [
        255,
        230,
        90,
        131,
        76,
        71,
        221,
        81
      ]
    },
    {
      "name": "pollClosed",
      "discriminator": [
        241,
        239,
        82,
        94,
        108,
        20,
        76,
        249
      ]
    },
    {
      "name": "pollCreated",
      "discriminator": [
        137,
        85,
        250,
        148,
        2,
        9,
        178,
        39
      ]
    },
    {
      "name": "voteCast",
      "discriminator": [
        39,
        53,
        195,
        104,
        188,
        17,
        225,
        213
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "pollStartInThePast",
      "msg": "Poll start is in the past"
    },
    {
      "code": 6001,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6002,
      "name": "pollAlreadyStarted",
      "msg": "Poll has already started"
    },
    {
      "code": 6003,
      "name": "pollEnded",
      "msg": "Poll has already ended"
    },
    {
      "code": 6004,
      "name": "pollNotStarted",
      "msg": "Poll has not started"
    },
    {
      "code": 6005,
      "name": "invalidCandidate",
      "msg": "Invalid candidate"
    },
    {
      "code": 6006,
      "name": "invalidPollEnd",
      "msg": "Invalid poll end"
    },
    {
      "code": 6007,
      "name": "pollNotEnded",
      "msg": "Poll has not ended"
    },
    {
      "code": 6008,
      "name": "invalidPollName",
      "msg": "Invalid poll name"
    }
  ],
  "types": [
    {
      "name": "candidate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollId",
            "type": "u64"
          },
          {
            "name": "candidateId",
            "type": "u32"
          },
          {
            "name": "candidateName",
            "type": "string"
          },
          {
            "name": "candidateDescription",
            "type": "string"
          },
          {
            "name": "votesCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "candidateCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollId",
            "type": "u64"
          },
          {
            "name": "candidateId",
            "type": "u32"
          },
          {
            "name": "candidateName",
            "type": "string"
          },
          {
            "name": "candidateDescription",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "poll",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollId",
            "type": "u64"
          },
          {
            "name": "pollName",
            "type": "string"
          },
          {
            "name": "pollDescription",
            "type": "string"
          },
          {
            "name": "pollStart",
            "type": "i64"
          },
          {
            "name": "pollEnd",
            "type": "i64"
          },
          {
            "name": "pollAuthority",
            "type": "pubkey"
          },
          {
            "name": "candidatesCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "pollClosed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollId",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "pollCounter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "pollCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollId",
            "type": "u64"
          },
          {
            "name": "pollName",
            "type": "string"
          },
          {
            "name": "pollDescription",
            "type": "string"
          },
          {
            "name": "pollStart",
            "type": "i64"
          },
          {
            "name": "pollEnd",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "vote",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollId",
            "type": "u64"
          },
          {
            "name": "candidateId",
            "type": "u32"
          },
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "voteCast",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollId",
            "type": "u64"
          },
          {
            "name": "candidateId",
            "type": "u32"
          },
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
