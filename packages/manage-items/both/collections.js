import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform', 'denyInsert', 'denyUpdate']);

Inventory = new Mongo.Collection('inventory');

inventorySchema = new SimpleSchema({
	itemName: {
		type: String,
		label: 'Name',
		max: 50,
		min: 2,
		autoform: {
			afFieldInput: {
				placeholder: 'Product name'
			}
		}
	},
	quantity: {
		type: Number,
		defaultValue: 0,
		min: 0
	},
	quantity_units: {
		type: String,
		defaultValue: 'g',
		allowedValues: ['ml', 'l', 'mg', 'g', 'kg'],
		autoform: {
			options: [
				{label: "ml", value: "ml"},
				{label: "l", value: "l"},
				{label: "mg", value: "mg"},
				{label: "g", value: "g"},
				{label: "kg", value: "kg"}
			]
		}
	},
	stock: {
		type: Number,
		label: 'Stock',
		defaultValue: 1,
		min: 0
	},
	description: {
		type: String,
		label: 'Description',
		min: 2,
		max: 4000,
		optional: true,
		autoform: {
			afFieldInput: {
				placeholder: 'Product description, brand, notes etc'
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
	category: {
		type: String,
		label: "Category",
		allowedValues: ['Perishables','Non-Perishables'],
		autoform: {
			options: [
				{label: "Perishables", value: "Perishables"},
				{label: "Non-Perishables", value: "Non-Perishables"}
			]
		},
		max: 1000
	},
	dateAdded: {
		type: Date,
		label: 'When was this item added?',
		autoValue: function () {
			return new Date();
		}
	}
});

Inventory.attachSchema(inventorySchema);

Inventory.permit('insert').ifLoggedIn();
Inventory.permit('update').ifLoggedIn();
Inventory.permit('remove').ifLoggedIn();