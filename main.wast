(module

  (memory 256 256)
  (export "memory")
  (export "fib" $test-func)

  (func $test (param $0 i32) (param $1 i32) (result i32)
    (local $2 i32)
    (return
      (select
        (set_local $2
          (select
            (i32.const 4)
            (i32.add
              (get_local $1)
              (i32.const 4)
            )
            (i32.gt_s
              (get_local $1)
              (i32.const 1)
            )
          )
        )
        (select
          (get_local $2)
          (i32.const 66)
          (i32.eq
            (get_local $2)
            (i32.const 5)
          )
        )
        (i32.gt_s
          (get_local $1)
          (i32.const 0)
        )
      )
    )
  )

)