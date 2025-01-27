export interface AirportData {
    id: string;
    iata: string;
    city: string;
    role: string;
    enplanements: number;
    country_code: string;
    region_name: string;
    airport_name: string;
    location: {
        lat: number;
        lng: number;
    };
}