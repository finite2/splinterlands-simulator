import { CardDetail, CardStats } from 'splinterlands-types';
import { GameTeam } from './game_team';
import { TeamNumber } from './types';
import { Ability } from './types';
import { getCardDetailFromId } from './utils/card_utils';

export class GameCard {
  private readonly cardDetail: CardDetail;
  private readonly cardLevel: number;
  private team: number = TeamNumber.UNKNOWN;

  protected gameTeam?: GameTeam;
  protected debuffsMap: Map<Ability, number> = new Map();
  protected buffsMap: Map<Ability, number> = new Map();
  abilities: Set<Ability> = new Set();
  speed = 0;
  startingArmor = 0;
  armor = 0;
  startingHealth = 0;
  health = 0;
  magic = 0;
  melee = 0;
  ranged = 0;
  mana = 0;

  constructor(cardDetail: CardDetail | number, cardLevel: number) {
    if (typeof cardDetail === 'number') {
      this.cardDetail = getCardDetailFromId(cardDetail);
    } else {
      this.cardDetail = cardDetail;
    }
    this.cardLevel = cardLevel - 1;

    this.setStats(this.cardDetail.stats);
  }

  public setTeam(teamNumber: TeamNumber) {
    this.team = teamNumber;
  }

  public setGameTeam(gameTeam: GameTeam) {
    this.gameTeam = gameTeam;
  }

  public getCardDetail(): CardDetail {
    return this.cardDetail;
  }

  /** Returns the card level (0 indexed) */
  public getCardLevel(): number {
    return this.cardLevel;
  }

  public hasAbility(ability: Ability) {
    return this.abilities.has(ability);
  }

  public removeAbility(ability: Ability) {
    this.abilities.delete(ability);
  }

  public getTeamNumber() {
    return this.team;
  }

  public getRarity(): number {
    return this.cardDetail.rarity;
  }

  public getName(): string {
    return this.cardDetail.name;
  }

  public getLevel(): number {
    return this.cardLevel;
  }

  public getDebuffs(): Map<Ability, number> {
    return this.debuffsMap;
  }

  public getBuffs(): Map<Ability, number> {
    return this.buffsMap;
  }

  public getCleanCard(): GameCard {
    return new GameCard(this.cardDetail, this.cardLevel + 1);
  }

  public clone(): GameCard {
    const clonedCard = new GameCard(this.cardDetail, this.cardLevel + 1);
    clonedCard.abilities = new Set(this.abilities);
    clonedCard.speed = this.speed;
    clonedCard.startingArmor = this.startingArmor;
    clonedCard.armor = this.armor;
    clonedCard.startingHealth = this.startingHealth;
    clonedCard.health = this.health;
    clonedCard.magic = this.magic;
    clonedCard.melee = this.melee;
    clonedCard.ranged = this.ranged;
    clonedCard.mana = this.mana;
    clonedCard.buffsMap = new Map(this.buffsMap);
    clonedCard.debuffsMap = new Map(this.debuffsMap);
    clonedCard.setTeam(this.team);

    return clonedCard;
  }

  private setStats(stats: CardStats) {
    this.speed = this.getStat(stats.speed);
    this.armor = this.getStat(stats.armor);
    this.startingArmor = this.armor;
    this.health = this.getStat(stats.health);
    this.startingHealth = this.health;
    this.magic = this.getStat(stats.magic);
    this.ranged = this.getStat(stats.ranged);
    this.melee = this.getStat(stats.attack);
    this.mana = this.getStat(stats.mana);
    this.addAbilities(stats.abilities);
  }

  private getStat(stat: number[] | number): number {
    return Array.isArray(stat) ? stat[this.cardLevel] : stat;
  }

  private addAbilities(abilities: Ability[] | Ability[][] | undefined) {
    if (abilities === undefined) {
      return;
    }
    // For monster
    if (Array.isArray(abilities[0])) {
      const relevantAbilities = (abilities as Ability[][]).slice(0, this.cardLevel + 1);
      const relevantAbilitiesArr: Ability[] = [];
      relevantAbilities.forEach((abilityArr) => {
        abilityArr.forEach((ability) => {
          relevantAbilitiesArr.push(ability);
        });
      });
      relevantAbilitiesArr.forEach((ability) => {
        this.abilities.add(ability);
      });
    } else {
      // For Summoner
      this.addAllAbilitiesArray(abilities as Ability[]);
    }
  }

  private addAllAbilitiesArray(abilities: Ability[]) {
    abilities.forEach((ability) => {
      this.abilities.add(ability);
    });
  }
}
