import jwt_decode from "jwt-decode";

class decode{
  jwt = (token) => {
    const {email, name, sub} = jwt_decode(token)
    const user = {
      memberId: sub,
      name: name,
      profileUrl: 'null',
      email: email
    }
    return user
  }
}

export default new decode();
