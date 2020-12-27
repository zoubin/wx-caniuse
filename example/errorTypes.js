const whitelist = [
  2339, // Property_0_does_not_exist_on_type_1
  2345, // Argument_of_type_0_is_not_assignable_to_parameter_of_type_1
  2551, // Property_0_does_not_exist_on_type_1_Did_you_mean_2
  2554, // Expected_0_arguments_but_got_1
  2555, // Expected_at_least_0_arguments_but_got_1
  2556, // Expected_0_arguments_but_got_1_or_more
  2557 // Expected_at_least_0_arguments_but_got_1_or_more
]
const blacklist = [
  2459, // Module_0_declares_1_locally_but_it_is_not_exported
  2691, // An_import_path_cannot_end_with_a_0_extension_Consider_importing_1_instead
  2525, // Initializer_provides_no_value_for_this_binding_element_and_the_binding_element_has_no_default_value
  2322, // Type_0_is_not_assignable_to_type_1
  2538, // Type_0_cannot_be_used_as_an_index_type
  2769, // No_overload_matches_this_call
]
module.exports = {
  whitelist, blacklist
}
