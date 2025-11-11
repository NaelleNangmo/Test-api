export interface Language { name: string }
export interface Currency { code?: string; name?: string; symbol?: string }


export interface Country {
name: string;
nativeName?: string;
alpha2Code?: string;
alpha3Code?: string;
capital?: string;
region?: string;
subregion?: string;
population?: number;
area?: number | null;
flag?: string;
languages?: Language[];
currencies?: Currency[];
timezones?: string[];
}