(module
  (memory 256 256)
  (export "memory")
  (export "fib" $test-func)
  (func $test-func (param $0 i32) (result i32)
    (if
      (i32.lt_s
        (get_local $0)
        (i32.const 2)
      )
      (i32.const 1)
      (i32.add
        (call $test-func
          (i32.sub
            (get_local $0)
            (i32.const 1)
          )
        )
        (call $test-func
          (i32.sub
            (get_local $0)
            (i32.const 2)
          )
        )
      )
    )
  )
)