{/* id_000*/
  "father":{/* id_001*/
    "age":32,
    "children":[/* id_002*/
      {/* id_003*/
         "age":5,
         "father":"[[id_001]]",
         "mother":{/* id_004*/
           "age":30,
           "children":[/* id_005*/
             "[[id_003]]",
             {/* id_006*/
                "age":10,
                "father":"[[id_001]]",
                "mother":"[[id_004]]",
                "name":"Henry"
              }
           ],
           "name":"Jane"
         },
         "name":"Sue"
       },
      "[[id_006]]"
    ],
    "name":"Frank"
  },
  "mother":"[[id_004]]"
}