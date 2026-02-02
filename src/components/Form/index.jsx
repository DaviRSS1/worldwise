// ""

import { useEffect, useState } from "react";
import { useUrlPosition } from "../../hooks/useUrlPosition";

import styles from "./Form.module.css";
import Button from "../Button";
import ButtonBack from "../ButtonBack";
import Message from "../Message";
import Spinner from "../Spinner";
import { convertToEmoji } from "../../utils/convertToEmoji";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useUrlPosition();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [emoji, setEmoji] = useState();
  const [geoCodingError, setGeocodingError] = useState("");

  useEffect(() => {
    async function fetchCity() {
      try {
        setGeocodingError("");
        setIsLoadingGeocoding(true);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryName)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else 🙁",
          );

        setCountry(data.countryName);
        setCityName(data.city || data.locality || "");
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeocodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }

    fetchCity();
  }, [lat, lng]);

  if (isLoadingGeocoding) return <Spinner />;

  if (geoCodingError) return <Message message={geoCodingError} />;

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
