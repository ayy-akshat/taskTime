import { StyleSheet } from "react-native"

const mainAppStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        textAlign: "center",
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginVertical: 30,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "gray",
        marginBottom: 30,
        textAlign: 'center'
    },
    rowContainer: {
        display: "flex",
        flexDirection: "row"
    }
})

export default mainAppStyles;