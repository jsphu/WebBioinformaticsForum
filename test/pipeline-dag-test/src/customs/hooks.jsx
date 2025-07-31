import React from "react";

export const datas = {
    fastqc: {
        label: "FASTQC",
        input: "*.fastq",
        output: "*.html",
        script: `#!bin/bash
        fastqc -i $input \
            -o $output \
            --log log.txt`,
    },
    input: {
        label: "INPUT",
        input: "*",
    },
    output: {
        label: "OUTPUT",
        output: "*",
    },
    creator: {
        label: "CREATOR",
    },
};
