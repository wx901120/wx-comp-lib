// let o1 = {
// 	name: 'wx',
// 	age: 18,
// 	girlFriends: ['wyc', 'xxx']
// }
// let o2 = { ...o1 }
// o2.name = 'aa'
// o2.girlFriends.push('wwww')
// console.log(o1 === o2)
// console.log(o1, o2)
// console.log(o1.girlFriends === o2.girlFriends)

let values = [1, 2, 3]
let allowedValues = [...values]
allowedValues.push('4')
console.log(values, allowedValues)
