import { axios } from 'axios';

export function getOffices(id) {
  axios
    .get('localhost:8080/api/office?officeId=' + id)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));

  axios.get('localhost:8080/api/walln@smu.edu/123').then((res) => {
    console.log(res);
  });
}
