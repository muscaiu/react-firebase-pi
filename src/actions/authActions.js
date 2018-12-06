export const login = (credentials, option) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    const firebase = getFirebase();
    const firestore = getFirestore();
    console.log('login action');

    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then((res) => {
      console.log('login sucess', option, typeof option);

      if (typeof option === "boolean") {
        firestore.collection('status').add({
          value: !option,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      }

      if (typeof option === "string") {
        firestore.collection('mode').add({
          value: option === 'manual' ? 'auto' : 'manual',
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
      }
    }).catch((err) => {
      console.log('login error', err);
    })
  }
}
