(module

  (memory 256 256)
  (export "memory")
  (export "fib" $test-func)

  (func $test (param $0 i32) (param $1 i32) (result i32)
    (local $2 i32)
    (local i64 i64)
    (set_local 1 (i64.const 1))
    (set_local 2 (i64.const 2))
    (block
      (loop
        (br_if 1 (i64.gt_u (get_local 2) (get_local 0)))
        (set_local 1 (i64.mul (get_local 1) (get_local 2)))
        (set_local 2 (i64.add (get_local 2) (i64.const 1)))
        (br 0)
      )
    )
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