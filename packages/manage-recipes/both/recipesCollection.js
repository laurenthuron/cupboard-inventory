import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform', 'denyInsert', 'denyUpdate']);

Recipes = new Mongo.Collection('recipes');

IngredientSchema = new SimpleSchema({
	itemName: {
		type: String,
		label: 'Ingredient name',
		max: 50,
		min: 2,
		autoform: {
			afFieldInput: {
				placeholder: 'Product name'
			}
		}
	},
	quantity: {
		type: String,
		label: 'Quantity required',
		min: 1,
		autoform: {
			afFieldInput: {
				placeholder: 'e.g. 280g'
			}
		}
	}
});

RecipesSchema = new SimpleSchema({
	recipeName: {
		type: String,
		label: 'Recipe Name',
		max: 50,
		min: 2,
		autoform: {
			afFieldInput: {
				placeholder: 'Recipe name'
			}
		}
	},
	recipePrepTime: {
		type: Number,
		min: 1,
		label: 'Preparation time'
	},
	recipeCookTime: {
		type: Number,
		min: 1,
		label: 'Cooking time'
	},
	recipeIngredients: {
		type: Array,
		label: 'Required Ingredients',
		minCount: 1
	},
	"recipeIngredients.$": {
		type: IngredientSchema,
		label: ' '
	},
	recipeMethod: {
		type: Array,
		label: 'Method',
		minCount: 1
	},
	"recipeMethod.$": {
		type: String,
		label: 'Method step',
		min: 2,
		max: 4000,
		autoform: {
			afFieldInput: {
				placeholder: 'Add a method step',
				rows: 6
			}
		},
		regEx: /^\w|\d|\s|[•◆√▸>'"\(\)!@#$%^&*+\-=\{\};:,.\/\\\|]+$/,
		custom: function () {
			let htmlTagsRegExp = /<(\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*))>/;
			if(htmlTagsRegExp.test(this.value)) { // We have html tags
				return "htmlTags";
			}
		}
	},
	recipeDescription: {
		type: String,
		label: 'Description',
		min: 2,
		max: 4000,
		optional: true,
		autoform: {
			afFieldInput: {
				placeholder: 'Product description, brand, notes etc',
				rows: 4
			}
		},
		regEx: /^\w|\d|\s|[•◆√▸>'"\(\)!@#$%^&*+\-=\{\};:,.\/\\\|]+$/,
		custom: function () {
			let htmlTagsRegExp = /<(\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*))>/;
			if(htmlTagsRegExp.test(this.value)) { // We have html tags
				return "htmlTags";
			}
		}
	},
	recipeCategory: {
		type: String,
		label: "Recipe Category",
		allowedValues: ['Dessert','Entree', 'MainCourse', 'Salad', 'Meat', 'Poultry', 'Vegetarian', 'Vegan'],
		autoform: {
			options: [
				{label: "Dessert", value: "Dessert"},
				{label: "Entree", value: "Entree"},
				{label: "Main Course", value: "MainCourse"},
				{label: "Salad", value: "Salad"},
				{label: "Meat", value: "Meat"},
				{label: "Poultry", value: "Poultry"},
				{label: "Vegetarian", value: "Vegetarian"},
				{label: "Vegan", value: "Vegan"}
			]
		},
		max: 1000
	},
	dateAdded: {
		type: Date,
		label: 'When was this recipe added?',
		autoValue: function () {
			return new Date();
		}
	}
});

Recipes.attachSchema(RecipesSchema);

Recipes.permit('insert').ifLoggedIn();
Recipes.permit('update').ifLoggedIn();
Recipes.permit('remove').ifLoggedIn();