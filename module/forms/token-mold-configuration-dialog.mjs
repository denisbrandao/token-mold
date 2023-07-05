import { HelpFormApplication } from "../about/help-form-application.mjs";
import { CONFIG } from "../config.mjs";
import { Logger } from "../logger/logger.mjs";
import { TokenMold } from "../token-mold.mjs";

export class TokenMoldConfigurationDialog extends HelpFormApplication {
	#ruleConfig = null;
	constructor(object, options) {
		if (!object) { object = {} }
		object.enableAboutButton = true;

		super(object, options);
		this.#ruleConfig = object?.ruleConfig ?? CONFIG.SETTINGS.CONFIGURATIONS.first();
		this.data = CONFIG.SETTINGS;
		this.barAttributes = CONFIG.BAR_ATTRIBUTES || [];
	}

	static get defaultOptions() {
		const options = super.defaultOptions;
		options.template = "modules/token-mold/templates/config.hbs";
		options.width = 420;
		// options.height = 460;
		options.resizable = false;
		options.classes = ["token-mold"];
		options.title = "Token Mold";
		options.closeOnSubmit = false;
		options.submitOnClose = true;
		options.submitOnChange = true;
		options.scrollY = ["section.content"];
//		options.dragDrop = [{ dropSelector: '.token-mold-config-tabs', dragSelector: '.token-mold-draggable-tab' }];
		options.tabs = [
			{
				navSelector: ".tabs",
				contentSelector: "form",
				initial: "Info",
			},
		];

		return options;
	}

	get title() {
		return `Token Mold - ${this.#ruleConfig.configName}`
	}

	async close(options={}) {
		super.close({force: true});
	}

	// _getHeaderButtons() {
	// 	let btns = super._getHeaderButtons();
	// 	Logger.debug(false, "HEADER BUTTONS!", btns);
	// 	btns.find(b => b.class === "close").label = game.i18n.localize("TOKEN-MOLD.CONFIG.Save");
	// 	return btns;
	// }

	activateListeners(html) {
		super.activateListeners(html);

		html.on('click', '[data-action]', this.#handleAction.bind(this));
		/*
		html.on("click", ".remove", (ev) => {
		  const container = $(ev.currentTarget).closest(".form-group");
	 
		  if (
			container.prev('.form-group:not(".header")').length > 0 ||
			container.next(".form-group").length > 0
		  )
			container.remove();
		});
	 
		html.find(".overlay").on("change keyup", "input.icon", (ev) => {
		  ev.target.parentNode.parentNode.getElementsByClassName(
			"prev"
		  )[0].innerHTML = "17&nbsp;" + ev.target.value;
		});
	 
		html.find(".name-replace").on("change", (ev) => {
		  const nameRandomizer =
			ev.currentTarget.parentNode.parentNode.querySelector(
			  ".name-randomizer-options"
			);
		  if (ev.currentTarget.value === "replace")
			nameRandomizer.style.display = "block";
		  else nameRandomizer.style.display = "none";
		});
		html.find(".name-replace").change();
	 
		html.on("click", ".add-language-value", (ev) => {
		  const addBtn = $(ev.target);
		  const clone = addBtn.prev().clone();
		  clone.find("input").val("");
		  clone.find("select").val("random");
		  addBtn.before(clone);
		});
	 
		html.on("click", ".add-language-attribute", (ev) => {
		  const addBtn = $(ev.target);
		  const clone = addBtn.prev().clone();
		  clone.children(".attribute").val("");
		  clone
			.children(".language-selection")
			.children(".language-group")
			.each((idx, el) => {
			  if (idx > 0) el.remove();
			});
		  const langSelection = clone.children(".language-selection");
		  langSelection.find("input").val("");
		  langSelection.find("select").val("random");
		  addBtn.before(clone);
		});
	 
		html.on("click", ".lang-remove", (ev) => {
		  const container = $(ev.currentTarget).closest(".form-group");
	 
		  let prev = container.prev(".form-group");
		  // only delete if not last element
		  if (prev.length > 0 || container.next(".form-group").length > 0)
			container.remove();
		  else {
			// alternatively delete whole attribute
			const parentContainer = container.closest(".attribute-group");
			if (
			  parentContainer.prev('.attribute-group:not(".default")').length > 0 ||
			  parentContainer.next('.attribute-group:not(".default")').length > 0
			) {
			  parentContainer.remove();
			}
		  }
		});
	 
		if (game.system.id === "dnd5e") {
		  const resetBtn = html.find(".reset");
		  //resetBtn[0].innerHTML = '<i class="fas fa-undo"></i>';
		  let resetLangs = (ev) => {};
		  resetBtn.on("click", (ev) => {
			this._resetOptions = true;
			this._onSubmit(ev);
		  });
		}
	 
		html[0].querySelector(".reroll-names").addEventListener("click", (ev) => {
		  const tokens = canvas.tokens.controlled;
		  let udata = [];
		  for (let token of tokens) {
			const newName = this.object._pickNewName(token.actor.data);
			udata.push({
			  _id: token.id,
			  name: newName,
			  "actorData.name": newName,
			});
		  }
	 
		  canvas.scene.updateEmbeddedDocuments("Token", udata);
		});
	    
	 
		html.on("click", ".reset-counter", async (ev) => {
		  const sceneId = canvas.scene.id;
	 
		  this.object.counter[sceneId] = {};
		  const tokens = canvas.scene.getEmbeddedCollection("Token");
	 
		  for (const token of tokens)
			if (token.actorId) this.object.counter[sceneId][token.actorId] = 0;
	 
		  ui.notifications.notify("Finished resetting counters");
		});
		*/
	}

	getData() {
		let data = {
			data: this.data,
			activeConfig: this.#ruleConfig
		};
		data.numberStyles = {
			ar: "arabic numerals",
			alu: "alphabetic UPPER",
			all: "alphabetic LOWER",
			ro: "roman numerals",
		};
		data.barAttributes = this.barAttributes;
		data.actorAttributes = this._actorAttributes;
		data.displayModes = CONST.TOKEN_DISPLAY_MODES;
		data.dispositions = CONST.TOKEN_DISPOSITIONS;
		data.defaultIcons = this.defaultIcons;
		data.showCreatureSize = /dnd5e|pf2e/.exec(game.data.system.id) !== null
		data.showHP = CONFIG.HP_SUPPORTED;
		data.showSystem = CONFIG.SYSTEM_SUPPORTED;
		data.languages = CONFIG.LANGUAGES;
		data.rollTableList = CONFIG.ROLLTABLES;
		data.visionLabel = game.i18n.localize("TOKEN.VisionEnabled")

		Logger.debug(false, "Prepared data", data, CONFIG.ROLLTABLES);
		return data;
	}
	
	async _updateObject(event, formData) {
		Logger.debug(false, formData);
		let min = formData["name.options.min"],
			max = formData["name.options.max"];
		if (min < 0) min = 0;
		if (max < 0) max = 0;

		if (min > max) {
			const tmp = min;
			(min = max), (max = tmp);
		}

		formData["name.options.min"] = min;
		formData["name.options.max"] = max;

		// For name prefix and suffix, if the value is only a space the formData doesn't pick it up, so check and manually set prior to merge.
		let prefix = $(this.form).find("input[name='name.number.prefix']").val();
		let suffix = $(this.form).find("input[name='name.number.suffix']").val();
		formData["name.number.prefix"] = formData["name.number.prefix"] !== prefix ? prefix : formData["name.number.prefix"];
		formData["name.number.suffix"] = formData["name.number.suffix"] !== suffix ? suffix : formData["name.number.suffix"];

		let currentConfig = this.data.CONFIGURATIONS.find(c => c.id === this.#ruleConfig.id);
		currentConfig = mergeObject(this.#ruleConfig, formData);

		//this.data.CONFIGURATIONS["Default"] = mergeObject(this.#ruleConfig, formData);

		// if (this._resetOptions === true) {
		// 	// this.object.data.name.options = this.object.dndDefaultNameOptions;

		// 	const dndOptions = this.dndDefaultNameOptions;
		// 	this.name.options.default = dndOptions.default;
		// 	this.data.name.options.attributes = dndOptions.attributes;
		// 	this._resetOptions = false;

		// 	this.render();
		// }

		this.render();
		TokenMold.SaveSettings();
	}

	async _onSubmit(ev) {
		const attrGroups = $(this.form).find(".attributes");
		let attrs = [];
		attrGroups.each((idx, e) => {
			const el = $(e);
			const icon = el.find(".icon").val(),
				value = el.find(".value").val();
			if (icon !== "" && value !== "")
				attrs.push({
					icon: icon,
					path: value,
				});
		});
		this.#ruleConfig.overlay.attrs = attrs;

		this.#ruleConfig.name.options.default = this.form
			.querySelector(".default-group")
			?.querySelector(".language")?.value;
		const attributes = [];

		const langAttrGroups = this.form.querySelectorAll(".attribute-selection");

		langAttrGroups.forEach((el) => {
			let ret = { languages: {} };
			ret.attribute = el.querySelector(".attribute").value;
			el.querySelectorAll(".language-group")?.forEach((langGroup) => {
				ret.languages[langGroup.querySelector(".value").value.toLowerCase()] =
					langGroup.querySelector(".language").value;
			});
			attributes.push(ret);
		});

		this.#ruleConfig.name.options.attributes = attributes;
		super._onSubmit(ev);
	}
	
	async #handleAction(event) {
		const clickedElement = $(event.currentTarget);
		const action = clickedElement.data().action;
		let index = clickedElement.data()?.index;

		switch (action) {
			case "add-attribute":
				this.#ruleConfig.name.options.attributes.push({attribute: "", languages: { "": "random"}});
				break;
			case "delete-attribute":
				this.#ruleConfig.name.options.attributes.splice(index, 1);
				break;
			default:
				break;
		}

		this.render(true);
	}

	static get defaultAttrs() {
		if (/dnd5e|sw5e/.exec(game.data.system.id) !== null) {
			return [
				{
					value: "system.attributes.ac.value",
					label: "Armor Class",
					icon: '<i class="fas fa-eye"></i>',
				},
				{
					value: "system.skills.prc.passive",
					label: "Passive Perception",
					icon: '<i class="fas fa-shield-alt"></i>',
				},
			];
		} else
			return [
				{
					icon: '<i class="fas fa-eye"></i>',
					value: "",
				},
			];
	}

	get defaultIcons() {
		return [
			"&#xf06e;", // eye
			"&#xf3ed; ", //fas fa-shield-alt"></i>',
			"&#xf6cf; ", //fas fa-dice-d20"></i>',
			"&#xf21e; ", //fas fa-heartbeat"></i>',
			"&#xf6e8; ", //fas fa-hat-wizard"></i>',
			"&#xf54b; ", //fas fa-shoe-prints"></i>',
			"&#xf554; ", //fas fa-walking"></i>',
			"&#xf70c; ", //fas fa-running"></i>',
			"&#xf51e; ", //fas fa-coins"></i>',
			"&#xf619; ", //fas fa-poop"></i>',
			"&#xf290; ", //fas fa-shopping-bag"></i>',
			"&#xf53a;", //fas fa-money-bill-wave"></i>',
			"&#xf0f2;", // fas fa-suitcase"></i>',
			"&#xf06d;", //fas fa-fire"></i>',
			"&#xf1b0;", //fas fa-paw"></i>',
			"&#xf787;", //fas fa-carrot"></i>',
			"&#xf5d7;", //fas fa-bone"></i>',
			"&#xf6d7;", //fas fa-drumstick-bite"></i>',
			"&#xf5d1;", //fas fa-apple-alt"></i>',
			"&#xf6de;", //fas fa-fist-raised"></i>',
			"&#xf669;", //fas fa-jedi"></i>',
			"&#xf753;", //fas fa-meteor"></i>',
			"&#xf186;", //fas fa-moon"></i>',
			"&#xf135;", //fas fa-rocket"></i>'
			"&#xf5dc;", // brain
			"&#xf1ae;", // child
		];
	}

	get languages() {
		return this.object.languages;
	}

	get _actorAttributes() {
		let getAttributes = function (data, parent) {
			parent = parent || [];
			let valid = [];
			for (let [k, v] of Object.entries(data)) {
				let p = parent.concat([k]);
				if (v instanceof Object) {
					valid = valid.concat(getAttributes(data[k], p));
				} else {
					valid.push(p);
				}
			}
			return valid;
		};

		let barAttributes = [];
		for (let type in game.system.model.Actor) {
			let newAttributes = getAttributes(game.system.model.Actor[type]).map(
				(e) => e.join(".")
			);

			// find duplicates
			for (let attr of newAttributes) {
				// Search if attribute already found
				let duplicate = barAttributes.find((el) => el[1].includes(attr));
				// If not found,  add to attributes
				if (duplicate === undefined) {
					barAttributes.push([type].concat(attr));
				} else {
					// if found add actor type to list
					duplicate[0] += ", " + type;
				}
			}
		}
		// Sort in groups by first element
		let groups = {};
		for (var attr of barAttributes) {
			const split = attr[1].split(".");
			const document = attr[0];
			const group = split[0];
			if (groups[group] === undefined) groups[group] = [];
			groups[group].push({
				document: document,
				attribute: split.splice(1).join("."),
			});
		}

		// also populate with some calculated data for dnd5e & sw5e, that is not in the template.json
		if (/dnd5e|sw5e/.exec(game.data.system.id) !== null) {
			let sortFun = function (a, b) {
				if (a.attribute > b.attribute) return 1;
				else if (a.attribute < b.attribute) return -1;
				return 0;
			};
			for (let skill of Object.keys(game.system.model.Actor["npc"].skills)) {
				groups["skills"].push({
					document: "character, npc",
					attribute: `${skill}.passive`,
				});
			}
			groups["skills"].sort(sortFun);
			if (groups["attributes"].find(a => a.attribute === "ac.value")) {
				groups["attributes"].find(a => a.attribute === "ac.value").document += ", character, npc";
			} else {
				groups["attributes"].push({
					document: "character, npc",
					attribute: "ac.value",
				});
			}
			groups["attributes"].sort(sortFun);
		}
		return groups;
	}

    // async _onDragStart(event) {
	// 	const key = $(event.target).closest("[data-key]").data().key;
	// 	Logger.debug(false, "Drag Start", event, key);

	// 	let transferData = {
	// 		key
	// 	};

	// 	event.dataTransfer.setData("text/plain", JSON.stringify(transferData));
	// }

	// async _onDragOver(event) {
	// 	const key = $(event.target).closest("[data-key]").data().key;
	// 	Logger.debug(false, "Drag Over", event, key);
		
	// }

	// async _onDrop(event) {
	// 	let data;
	// 	try {
	// 		data = JSON.parse(event.dataTransfer.getData("text/plain"));
	// 	} catch (err) {
	// 		return false;
	// 	}

	// 	const nearestKey = $(event.target).closest("[data-key]")?.data()?.key;
	// 	Logger.debug(false, "Nearest Key:", nearestKey);
	// }
}