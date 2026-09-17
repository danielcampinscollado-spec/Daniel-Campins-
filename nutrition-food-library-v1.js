/* DCC — Biblioteca central de alimentos para el editor de alimentación. */
(function(){
'use strict';

const BUILD='20260917-food-library-v1';
if(window.DCCFoodLibrary?.build===BUILD)return;

const CATEGORIES=[
  {id:'protein',name:'Proteínas',order:1},
  {id:'carbs',name:'Carbohidratos',order:2},
  {id:'fruit',name:'Frutas',order:3},
  {id:'vegetables',name:'Verduras',order:4},
  {id:'fats',name:'Grasas',order:5}
];

const FOOD=(id,name,category,defaultUnit='g',units=['g'])=>Object.freeze({
  id,name,category,defaultUnit,units:Object.freeze([...units])
});

const FOODS=Object.freeze([
  // PROTEÍNAS
  FOOD('chicken-breast','Pechuga de pollo','protein'),
  FOOD('turkey-breast','Pechuga de pavo','protein'),
  FOOD('turkey-slices','Pavo en lonchas','protein','g',['g','lonchas']),
  FOOD('lean-beef','Ternera magra','protein'),
  FOOD('beef-mince-lean','Carne picada de ternera magra','protein'),
  FOOD('pork-loin','Lomo de cerdo','protein'),
  FOOD('pork-tenderloin','Solomillo de cerdo','protein'),
  FOOD('rabbit','Conejo','protein'),
  FOOD('hake','Merluza','protein'),
  FOOD('cod','Bacalao','protein'),
  FOOD('sea-bass','Lubina','protein'),
  FOOD('sea-bream','Dorada','protein'),
  FOOD('tuna','Atún','protein'),
  FOOD('tuna-can','Atún en lata','protein','g',['g','latas']),
  FOOD('salmon','Salmón','protein'),
  FOOD('prawns','Gambas / langostinos','protein'),
  FOOD('octopus','Pulpo','protein'),
  FOOD('squid','Calamar','protein'),
  FOOD('mussels','Mejillones','protein'),
  FOOD('whole-egg','Huevo entero','protein','unidades',['unidades','g']),
  FOOD('egg-whites','Claras de huevo','protein','g',['g','ml']),
  FOOD('greek-yogurt','Yogur griego natural','protein','g',['g','unidades']),
  FOOD('skyr','Skyr','protein','g',['g','unidades']),
  FOOD('quark','Queso quark','protein'),
  FOOD('cottage-cheese','Queso cottage','protein'),
  FOOD('fresh-cheese','Queso fresco','protein'),
  FOOD('tofu','Tofu','protein'),
  FOOD('tempeh','Tempeh','protein'),

  // CARBOHIDRATOS
  FOOD('white-rice','Arroz blanco','carbs'),
  FOOD('basmati-rice','Arroz basmati','carbs'),
  FOOD('brown-rice','Arroz integral','carbs'),
  FOOD('pasta','Pasta','carbs'),
  FOOD('whole-pasta','Pasta integral','carbs'),
  FOOD('oats','Avena','carbs'),
  FOOD('potato','Patata','carbs'),
  FOOD('sweet-potato','Boniato','carbs'),
  FOOD('white-bread','Pan blanco','carbs','g',['g','rebanadas']),
  FOOD('whole-bread','Pan integral','carbs','g',['g','rebanadas']),
  FOOD('sourdough-bread','Pan de masa madre','carbs','g',['g','rebanadas']),
  FOOD('corn-tortilla','Tortilla de maíz','carbs','unidades',['unidades','g']),
  FOOD('wheat-tortilla','Tortilla de trigo','carbs','unidades',['unidades','g']),
  FOOD('rice-cakes','Tortitas de arroz','carbs','unidades',['unidades','g']),
  FOOD('corn-cakes','Tortitas de maíz','carbs','unidades',['unidades','g']),
  FOOD('quinoa','Quinoa','carbs'),
  FOOD('couscous','Cuscús','carbs'),
  FOOD('bulgur','Bulgur','carbs'),
  FOOD('chickpeas','Garbanzos','carbs'),
  FOOD('lentils','Lentejas','carbs'),
  FOOD('beans','Alubias','carbs'),
  FOOD('peas','Guisantes','carbs'),
  FOOD('corn','Maíz','carbs'),
  FOOD('breakfast-cereal','Cereales de desayuno','carbs'),
  FOOD('cream-rice','Crema de arroz','carbs'),

  // FRUTAS
  FOOD('apple','Manzana','fruit','unidades',['unidades','g']),
  FOOD('banana','Plátano','fruit','unidades',['unidades','g']),
  FOOD('orange','Naranja','fruit','unidades',['unidades','g']),
  FOOD('mandarin','Mandarina','fruit','unidades',['unidades','g']),
  FOOD('pear','Pera','fruit','unidades',['unidades','g']),
  FOOD('kiwi','Kiwi','fruit','unidades',['unidades','g']),
  FOOD('peach','Melocotón','fruit','unidades',['unidades','g']),
  FOOD('nectarine','Nectarina','fruit','unidades',['unidades','g']),
  FOOD('plum','Ciruela','fruit','unidades',['unidades','g']),
  FOOD('strawberry','Fresas','fruit'),
  FOOD('blueberries','Arándanos','fruit'),
  FOOD('raspberries','Frambuesas','fruit'),
  FOOD('blackberries','Moras','fruit'),
  FOOD('pineapple','Piña','fruit'),
  FOOD('mango','Mango','fruit','g',['g','unidades']),
  FOOD('grapes','Uvas','fruit'),
  FOOD('watermelon','Sandía','fruit'),
  FOOD('melon','Melón','fruit'),
  FOOD('papaya','Papaya','fruit'),
  FOOD('cherries','Cerezas','fruit'),
  FOOD('pomegranate','Granada','fruit','unidades',['unidades','g']),

  // VERDURAS
  FOOD('broccoli','Brócoli','vegetables'),
  FOOD('cauliflower','Coliflor','vegetables'),
  FOOD('zucchini','Calabacín','vegetables'),
  FOOD('eggplant','Berenjena','vegetables'),
  FOOD('spinach','Espinacas','vegetables'),
  FOOD('lettuce','Lechuga','vegetables'),
  FOOD('tomato','Tomate','vegetables','g',['g','unidades']),
  FOOD('cherry-tomato','Tomate cherry','vegetables'),
  FOOD('carrot','Zanahoria','vegetables','g',['g','unidades']),
  FOOD('red-pepper','Pimiento rojo','vegetables'),
  FOOD('green-pepper','Pimiento verde','vegetables'),
  FOOD('onion','Cebolla','vegetables'),
  FOOD('cucumber','Pepino','vegetables'),
  FOOD('asparagus','Espárragos','vegetables'),
  FOOD('mushrooms','Champiñones','vegetables'),
  FOOD('green-beans','Judías verdes','vegetables'),
  FOOD('artichoke','Alcachofa','vegetables'),
  FOOD('pumpkin','Calabaza','vegetables'),
  FOOD('cabbage','Col / repollo','vegetables'),
  FOOD('celery','Apio','vegetables'),

  // GRASAS
  FOOD('olive-oil','Aceite de oliva virgen extra','fats','g',['g','ml']),
  FOOD('avocado','Aguacate','fats','g',['g','unidades']),
  FOOD('almonds','Almendras','fats'),
  FOOD('walnuts','Nueces','fats'),
  FOOD('cashews','Anacardos','fats'),
  FOOD('pistachios','Pistachos','fats'),
  FOOD('hazelnuts','Avellanas','fats'),
  FOOD('peanuts','Cacahuetes','fats'),
  FOOD('peanut-butter','Crema de cacahuete','fats'),
  FOOD('almond-butter','Crema de almendra','fats'),
  FOOD('tahini','Tahini','fats'),
  FOOD('chia-seeds','Semillas de chía','fats'),
  FOOD('flax-seeds','Semillas de lino','fats'),
  FOOD('pumpkin-seeds','Semillas de calabaza','fats'),
  FOOD('sunflower-seeds','Semillas de girasol','fats'),
  FOOD('olives','Aceitunas','fats','g',['g','unidades']),
  FOOD('coconut','Coco','fats')
]);

const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const byCategory=category=>FOODS.filter(food=>food.category===category);
const find=id=>FOODS.find(food=>food.id===id)||null;
const search=(query,category)=>{
  const q=normalize(query);
  return FOODS.filter(food=>(!category||food.category===category)&&(!q||normalize(food.name).includes(q)));
};

window.DCCFoodLibrary=Object.freeze({
  build:BUILD,
  categories:Object.freeze(CATEGORIES.map(Object.freeze)),
  foods:FOODS,
  byCategory,
  find,
  search
});
})();
