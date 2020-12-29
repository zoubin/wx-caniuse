const blacklist = [
  1064, 'The_return_type_of_an_async_function_or_method_must_be_the_global_Promise_T_type',
  1259, 'Module_0_can_only_be_default_imported_using_the_1_flag',
  1345, 'An_expression_of_type_void_cannot_be_tested_for_truthiness',
  2304, 'Cannot_find_name_0',
  2305, 'Module_0_has_no_exported_member_1',
  2323, 'Cannot_redeclare_exported_variable_0',
  2341, 'Property_0_is_private_and_only_accessible_within_class_1',
  2350, 'Only_a_void_function_can_be_called_with_the_new_keyword',
  2363, 'The_right_hand_side_of_an_arithmetic_operation_must_be_of_type_any_number_bigint_or_an_enum_type',
  2365, 'Operator_0_cannot_be_applied_to_types_1_and_2',
  2367, 'This_condition_will_always_return_0_since_the_types_1_and_2_have_no_overlap',
  2403, 'Subsequent_variable_declarations_must_have_the_same_type_Variable_0_must_be_of_type_1_but_here_has_type_2',
  2459, 'Module_0_declares_1_locally_but_it_is_not_exported',
  2515, 'Non_abstract_class_0_does_not_implement_inherited_abstract_member_1_from_class_2',
  2525, 'Initializer_provides_no_value_for_this_binding_element_and_the_binding_element_has_no_default_value',
  2538, 'Type_0_cannot_be_used_as_an_index_type',
  2695, 'Left_side_of_comma_operator_is_unused_and_has_no_side_effects',
  2769, 'No_overload_matches_this_call',
  //8020, 'JSDoc_types_can_only_be_used_inside_documentation_comments',
  //8021, 'JSDoc_typedef_tag_should_either_have_a_type_annotation_or_be_followed_by_property_or_member_tags',
  //8022, 'JSDoc_0_is_not_attached_to_a_class',
  //8023, 'JSDoc_0_1_does_not_match_the_extends_2_clause',
  //8024, 'JSDoc_param_tag_has_name_0_but_there_is_no_parameter_with_that_name',
].filter(x => !isNaN(x))

module.exports = function ({ code, message }, next) {
  if (code === 2339) {
    // Property_0_does_not_exist_on_type_1
    // Only output 'WX'
    return message[0].includes(`does not exist on type 'WX'`)
  }
  if (blacklist.includes(code)) return false
  return next()
}
