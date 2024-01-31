export interface BettingEntity {
    address: string
    gameId: number
    eggs: number
    position: number
    merkleRoot: string | null
    merkleProof: string[] | null
    reward: number | null
  }
  
  export interface GameEntity {
    gameId: number
    positionNum: number 
    winnerPosition: number | null
    endTime: Date
    isEnded: boolean
  }

export interface UserEntity {
  address: string
  chicken: number
  egg: number
}