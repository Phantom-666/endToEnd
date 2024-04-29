export type UsersType = {
  _id: string
  name: string
}

export type UsersTypeFromServer = {
  data: {
    users: UsersType[]
  }
}
