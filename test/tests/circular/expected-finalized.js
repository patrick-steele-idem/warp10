{/* id_000*/
  "father":{/* id_001*/
    "age":32,
    "children":[/* id_002*/
      {/* id_003*/
         "age":5,
         "father":"[[id_001]]",
         "mother":{/* id_004*/
           "age":30,
           "children":"[[id_002]]",
           "name":"Jane"
         },
         "name":"Sue"
       },
      {/* id_005*/
         "age":10,
         "father":"[[id_001]]",
         "mother":"[[id_004]]",
         "name":"Henry"
       }
    ],
    "name":"Frank"
  },
  "mother":"[[id_004]]"
}