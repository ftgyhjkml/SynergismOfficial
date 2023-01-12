import { DynamicUpgrade } from './DynamicUpgrade';
import type { IUpgradeData } from './DynamicUpgrade';
import { Alert, Prompt } from './UpdateHTML';
import { format, player } from './Synergism';

export type blueberryUpgradeNames = 'ambrosiaTutorial' | 'ambrosiaQuarks' | 'ambrosiaCubes' | 'ambrosiaObtainium'

export interface IBlueberryData extends IUpgradeData {
    costFormula (level: number, baseCost: number): number
    rewards(n: number): {[key: string]: number | boolean}
    rewardDesc(n: number): string
    ambrosiaInvested?: number
    prerequisites?: Record<blueberryUpgradeNames, number>
}

export class BlueberryUpgrade extends DynamicUpgrade {
    readonly costFormula: (level: number, baseCost: number) => number
    public ambrosiaInvested = 0
    readonly preRequisites: Record<blueberryUpgradeNames, number> | undefined

    constructor(data: IBlueberryData) {
        super(data);
        this.costFormula = data.costFormula;
        this.ambrosiaInvested = data.ambrosiaInvested ?? 0;
        this.preRequisites = data.prerequisites ?? undefined
    }

    getCostTNL(): number {
        if (this.level === this.maxLevel) {
            return 0
        }
        return this.costFormula(this.level, this.costPerLevel)
    }

    /**
     * Buy levels up until togglebuy or maxed.
     * @returns An alert indicating cannot afford, already maxed or purchased with how many
     *          levels purchased
     */
    public async buyLevel(event: MouseEvent): Promise<void> {
        let purchased = 0;
        let maxPurchasable = 1;
        let ambrosiaBudget = player.ambrosia;

        if (event.shiftKey) {
            maxPurchasable = 1000000
            const buy = Number(await Prompt(`How many Ambrosia would you like to spend? You have ${format(player.ambrosia, 0, true)} Ambrosia. Type -1 to use max!`))

            if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy)) { // nan + Infinity checks
                return Alert('Value must be a finite number!');
            }

            if (buy === -1) {
                ambrosiaBudget = player.ambrosia
            } else if (buy <= 0) {
                return Alert('Purchase cancelled!')
            } else {
                ambrosiaBudget = buy
            }
            ambrosiaBudget = Math.min(player.ambrosia, ambrosiaBudget)
        }

        if (this.maxLevel > 0) {
            maxPurchasable = Math.min(maxPurchasable, this.maxLevel - this.level)
        }

        if (maxPurchasable === 0) {
            return Alert('Hey! You have already maxed this upgrade. :D')
        }

        while (maxPurchasable > 0) {
            const cost = this.getCostTNL();
            if (player.ambrosia < cost || ambrosiaBudget < cost) {
                break;
            } else {
                player.ambrosia -= cost;
                ambrosiaBudget -= cost;
                this.ambrosiaInvested += cost
                this.level += 1;
                purchased += 1;
                maxPurchasable -= 1;
            }
        }

        if (purchased === 0) {
            return Alert('You cannot afford this upgrade. Sorry!')
        }
        if (purchased > 1) {
            return Alert(`Purchased ${format(purchased)} levels, thanks to Multi Buy!`)
        }

        this.updateUpgradeHTML();
    }

    toString(): string {
        return 'WIP'
    }

    updateUpgradeHTML(): void {
        // WIP
    }

}

export const blueberryUpgradeData: Record<blueberryUpgradeNames, IBlueberryData> = {
    ambrosiaTutorial: {
        name: 'Ambrosia Tutorial Module',
        description: 'Blueberries have a small chance every real-life second to give ambrosia. Spend them in the Ambrosia "tree"!',
        maxLevel: 10,
        costPerLevel: 10,
        costFormula: (level: number, baseCost: number): number => {
            return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
        },
        rewards: (n: number) => {
            return {
                quarks: 1 + 0.01 * n,
                cubes: 1 + 0.05 * n

            }
        },
        rewardDesc: (n: number): string => {
            return `This tutorial module increases cube gain by ${format(5 * n)}% and quarks by ${format(n)}%`
        }
    },
    ambrosiaQuarks: {
        name: 'Ambrosia Tutorial Module',
        description: 'Blueberries have a small chance every real-life second to give ambrosia. Spend them in the Ambrosia "tree"!',
        maxLevel: 10,
        costPerLevel: 10,
        costFormula: (level: number, baseCost: number): number => {
            return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
        },
        rewards: (n: number) => {
            return {
                quarks: 1 + 0.01 * n,
                cubes: 1 + 0.05 * n

            }
        },
        rewardDesc: (n: number): string => {
            return `This tutorial module increases cube gain by ${format(5 * n)}% and quarks by ${format(n)}%`
        }
    },
    ambrosiaCubes: {
        name: 'Ambrosia Tutorial Module',
        description: 'Blueberries have a small chance every real-life second to give ambrosia. Spend them in the Ambrosia "tree"!',
        maxLevel: 10,
        costPerLevel: 10,
        costFormula: (level: number, baseCost: number): number => {
            return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
        },
        rewards: (n: number) => {
            return {
                quarks: 1 + 0.01 * n,
                cubes: 1 + 0.05 * n

            }
        },
        rewardDesc: (n: number): string => {
            return `This tutorial module increases cube gain by ${format(5 * n)}% and quarks by ${format(n)}%`
        }
    },
    ambrosiaObtainium: {
        name: 'Ambrosia Tutorial Module',
        description: 'Blueberries have a small chance every real-life second to give ambrosia. Spend them in the Ambrosia "tree"!',
        maxLevel: 10,
        costPerLevel: 10,
        costFormula: (level: number, baseCost: number): number => {
            return baseCost * (Math.pow(level + 1, 2) - Math.pow(level, 2))
        },
        rewards: (n: number) => {
            return {
                quarks: 1 + 0.01 * n,
                cubes: 1 + 0.05 * n

            }
        },
        rewardDesc: (n: number): string => {
            return `This tutorial module increases cube gain by ${format(5 * n)}% and quarks by ${format(n)}%`
        }
    }

}