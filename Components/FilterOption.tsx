// import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
// import { Filter } from '../hooks/useFilter';
// import mainStyle from '../styles/main.module.scss'


// interface FilterOptionProps {
//   category: Filter,
//   checkBoxRefs: MutableRefObject<HTMLInputElement[] | null[]>
// }

// const FilterOption = (props: FilterOptionProps) => {
//   const { category, checkBoxRefs } = props;

//   const checkCheckBox = useCallback(() => {
//     const hasDefaultCheckedValue = category.options.filter(op => op.isChecked);
//     if (hasDefaultCheckedValue.length === 0) return;

//     checkBoxRefs.current.forEach((ref, index) => {
//       if (!ref) return;
//       ref.checked = category.options[index].isChecked;
//     });

//   }, [category.options, checkBoxRefs]);


//   useEffect(() => {
//     checkCheckBox();

//   }, [checkCheckBox])

//   return(
//     <div className={mainStyle["option-list"]}>
//       {
//         category.options.map((option, index) => {
//           return (
//             <div key={index} className={`${mainStyle.item}`}>
//               <input type="checkbox" id={option.name} ref={el => (checkBoxRefs.current[index] = el)} />
//               <label htmlFor={ option.name } onClick={()=> category.fn(option, checkBoxRefs.current[index === 0 || index < category.options.length - 1 ? index + 1 : index = -1 ],category.options)}> {option.name} </label>
//             </div>
//           )
//         })
//       }
//     </div>
//   )
// }

// export default FilterOption;